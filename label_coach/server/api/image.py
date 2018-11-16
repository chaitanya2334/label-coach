import os
import os
import re
import traceback
from io import BytesIO
from random import random

import cherrypy
from PIL import Image
from bson.json_util import dumps

from girder.api import access, rest
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, setCurrentUser
from girder.constants import AccessType
from girder.models.assetstore import Assetstore
from girder.models.collection import Collection
from girder.models.file import File
from girder.models.item import Item

from girder.models.folder import Folder
from ..bcolors import printOk, printFail, printOk2
from ..deepzoom import load_slide
from ..utils import trace, writeData, writeBytes


class PILBytesIO(BytesIO):
    def fileno(self):
        """Classic PIL doesn't understand io.UnsupportedOperation."""
        raise AttributeError('Not supported')


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
        elif ext == ".svs":
            return "application/octet-stream"

    def __filter(self, items, exts):
        ret = []
        for item in items:
            name, ext = os.path.splitext(item['name'])
            if ext.lower() in exts:
                item['mimeType'] = self.__set_mime_type(ext)
                ret.append(item)

        return ret

    @access.public
    @autoDescribeRoute(
        Description('Get image list').param('folderId', 'folder id'))
    @rest.rawResponse
    @trace
    def getImageList(self, folderId):
        printOk('getImageList() was called!')
        self.user = self.getCurrentUser()
        folder = Folder().load(folderId, level=AccessType.READ, user=self.getCurrentUser())
        items = Folder().childItems(folder)
        items = self.__filter(items, exts=[".jpg", ".jpeg", ".svs"])
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
            if file['name'] == fname:
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
        resp = self.__create_thumbnail(item, w, h)
        printOk2("thumbnail file just created")
        cherrypy.response.headers["Content-Type"] = "application/jpeg"
        return resp

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
            return buf.getvalue()
