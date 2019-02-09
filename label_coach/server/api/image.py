import os
import re
import timeit
from io import BytesIO

import cherrypy
from PIL import Image
from bson.json_util import dumps
from girder.api import access, rest
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource
from girder.constants import AccessType
from girder.models.assetstore import Assetstore
from girder.models.collection import Collection
from girder.models.file import File
from girder.models.folder import Folder
from girder.models.item import Item

from ..bcolors import printOk, printOk2
from ..deepzoom import load_slide
from ..utils import trace, writeBytes, PILBytesIO


class ImageResource(Resource):

    def __init__(self):
        super().__init__()
        self.resourceName = 'image'
        self.cp_config = {'tools.staticdir.on': True,
                          'tools.staticdir.index': 'index.html'}
        self.route('GET', (), handler=self.getImageList)
        self.route('GET', (':image_id',), self.getImage)
        self.route('GET', ('thumbnail',), self.getThumbnail)
        self.route('GET', ('dzi', ':image_id',), self.dzi)
        self.route('GET', ('dzi', ':image_id', ':level', ':tfile'), self.tile)

    @staticmethod
    def __load_slides(file):
        printOk2(file)
        assetstore = Assetstore().load(file['assetstoreId'])
        slides, associated_images, slide_properties, slide_mpp = \
            load_slide(os.path.join(assetstore['root'], file['path']))

        return slides

    def find_label_id(self, folder, name):
        collection_model = Collection()
        labels = Folder().fileList(doc=folder, user=self.getCurrentUser(), data=False, includeMetadata=True,
                                   mimeFilter=['application/json'])
        for labelname, label in labels:
            labelname = os.path.splitext(labelname)[0]
            printOk2("labelname: " + labelname + " " + name)
            if labelname == name:
                return label['_id']

    @staticmethod
    def __set_mime_type(ext):
        if ext == ".jpg" or ext == ".jpeg":
            return "image/jpeg"
        elif ext == ".png" or ext == ".PNG":
            return "image/png"
        elif ext == ".svs":
            return "application/octet-stream"

    def __filter(self, items, exts):
        ret = []
        for item in items:
            name, ext = os.path.splitext(item['name'])
            ext = ext.lower()
            if ext in exts:
                item['mimeType'] = self.__set_mime_type(ext)
                ret.append(item)

        return ret

    @access.public
    @autoDescribeRoute(
        Description('Get image list')
            .param('folderId', 'folder id')
            .param('limit', 'Number of assignments to return')
            .param('offset', 'offset from 0th assignment to start looking for assignments'))
    @rest.rawResponse
    @trace
    def getImageList(self, folderId, limit, offset):
        printOk('getImageList() was called!')
        limit, offset = int(limit), int(offset)
        self.user = self.getCurrentUser()
        folder = Folder().load(folderId, level=AccessType.READ, user=self.getCurrentUser())
        items = Folder().childItems(folder, limit=limit, offset=offset)
        items = self.__filter(items, exts=[".jpg", ".jpeg", ".png", ".PNG", ".svs"])
        ret_files = []
        for item in items:
            # TODO: remove this function
            filename = os.path.splitext(item['name'])[0]
            printOk("filename: " + filename)
            ret_files.append(item)

        cherrypy.response.headers["Content-Type"] = "application/json"
        return dumps(ret_files)

    @access.public
    @autoDescribeRoute(
        Description('Get dzi')
            .param('image_id', 'image file id'))
    @rest.rawResponse
    @trace
    def dzi(self, image_id):
        printOk('getDzi() was called!')
        item = Item().load(image_id, level=AccessType.READ, user=self.user)
        file = self.__get_file(item, item['name'])
        slides = self.__load_slides(file)
        resp = slides['slide'].get_dzi('jpeg')
        cherrypy.response.headers["Content-Type"] = "application/xml"
        return resp

    def __get_file(self, item, fname):
        files = Item().fileList(item, user=self.getCurrentUser(), data=False)
        for filepath, file in files:
            if fname in file['name']:
                return file

    @access.public
    @autoDescribeRoute(
        Description('Get image')
            .param('image_id', 'image file id'))
    @rest.rawResponse
    @trace
    def getImage(self, image_id):
        item = Item().load(image_id, level=AccessType.READ, user=self.user)
        file = self.__get_file(item, item['name'])
        cherrypy.response.headers["Content-Type"] = "application/png"
        return File().download(file, headers=False)

    @access.public
    @autoDescribeRoute(
        Description('get tiles'))
    @rest.rawResponse
    @trace
    def tile(self, image_id, level, tfile):
        image_id = re.search(r'(.*)_files', image_id).group(1)
        item = Item().load(image_id, level=AccessType.READ, user=self.user)
        file = self.__get_file(item, item['name'])
        slides = self.__load_slides(file)
        pos, _format = tfile.split('.')
        col, row = pos.split('_')
        _format = _format.lower()
        if _format != 'jpeg' and _format != 'png':
            # Not supported by Deep Zoom
            cherrypy.response.status = 404

        tile_image = slides['slide'].get_tile(int(level), (int(col), int(row)))
        buf = PILBytesIO()
        tile_image.save(buf, _format, quality=100)
        cherrypy.response.headers["Content-Type"] = 'image/%s' % _format
        resp = buf.getvalue()
        return resp

    @access.public
    @autoDescribeRoute(
        Description('Get thumbnail by size')
            .param('image_id', 'image file id')
            .param('w', 'thumbnail width')
            .param('h', 'thumbnail height', required=False))
    @rest.rawResponse
    @trace
    def getThumbnail(self, image_id, w, h=None):
        item = Item().load(image_id, level=AccessType.READ, user=self.user)
        start_time = timeit.default_timer()
        if not h:
            filename = "thumbnail_{}".format(w)
        else:
            filename = "thumbnail_{}x{}".format(w, h)

        file = self.__get_file(item, filename)
        if not file:
            file = self.__create_thumbnail(item, w, h)

        elapsed_time = timeit.default_timer() - start_time
        printOk2("thumbnail file just created in {}".format(elapsed_time))
        cherrypy.response.headers["Content-Type"] = "application/jpeg"
        return File().download(file, headers=False)

    def __create_thumbnail(self, item, w, h):
        w = int(w)
        file = self.__get_file(item, item['name'])
        with File().open(file) as f:
            image = Image.open(BytesIO(f.read()))
            if not h:
                width, height = image.size
                h = (height / width) * w

            h = int(h)
            image.thumbnail((w, h))
            buf = PILBytesIO()
            image.save(buf, "jpeg", quality=100)
            thumbnailFile = File().createFile(size=0,
                                              item=item,
                                              name="thumbnail_{}x{}.jpg".format(w, h),
                                              creator=self.user,
                                              assetstore=Assetstore().getCurrent(),
                                              mimeType="application/jpeg")
            writeBytes(self.user, thumbnailFile, buf.getvalue())
            thumbnailFile = self.__get_file(item, "thumbnail_{}x{}.jpg".format(w, h))
            return thumbnailFile
