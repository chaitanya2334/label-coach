import os
import os
import re
import traceback
from io import BytesIO

import cherrypy
from bson.json_util import dumps

from girder.api import access, rest
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, setCurrentUser
from girder.constants import AccessType
from girder.models.assetstore import Assetstore
from girder.models.collection import Collection
from girder.models.file import File
from girder.models.user import User

from girder.models.folder import Folder
from ..bcolors import printOk, printFail, printOk2
from ..deepzoom import load_slide


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
        self.route('GET', ('dzi', ':image_id',), self.dzi)
        self.route('GET', ('dzi', ':image_id', ':level', ':tfile'), self.tile)

    def load_slides(self, image_id):
        file = File().load(image_id, level=AccessType.READ, user=self.user)
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

    @access.public
    @autoDescribeRoute(
        Description('Get image list').param('folderId', 'folder id'))
    @rest.rawResponse
    def getImageList(self, folderId):
        printOk('getImageList() was called!')

        try:
            folderModel = Folder()
            self.user = self.getCurrentUser()
            folder = folderModel.load(folderId, level=AccessType.READ, user=self.getCurrentUser())
            files = folderModel.fileList(doc=folder, user=self.getCurrentUser(), data=False, includeMetadata=True,
                                         mimeFilter=['application/octet-stream', 'image/png', 'image/jpeg'])
            ret_files = []
            for filename, file in files:
                filename = os.path.splitext(filename)[0]
                printOk("filename: " + filename)
                file['label_id'] = self.find_label_id(folder, filename)
                ret_files.append(file)

            cherrypy.response.headers["Content-Type"] = "application/json"
            return dumps(ret_files)

        except:
            printFail(traceback.print_exc)

    @access.public
    @autoDescribeRoute(
        Description('Get dzi')
            .param('image_id', 'image file id'))
    @rest.rawResponse
    def dzi(self, image_id):
        printOk('getDzi() was called!')
        printOk('params is ' + image_id)

        try:
            printOk(self.getCurrentToken())
            printOk(self.getCurrentUser())

            slides = self.load_slides(image_id)

            resp = slides['slide'].get_dzi('jpeg')
            cherrypy.response.headers["Content-Type"] = "application/xml"
            return resp

        except:
            # Unknown slug
            printFail(traceback.print_exc)
            cherrypy.response.status = 404

    @access.public
    @autoDescribeRoute(
        Description('Get image')
            .param('image_id', 'image file id'))
    @rest.rawResponse
    def getImage(self, image_id):
        printOk('getImage() was called!')
        printOk('params is ' + image_id)

        try:
            file = File().load(image_id, level=AccessType.READ, user=self.user)
            cherrypy.response.headers["Content-Type"] = "application/png"
            return File().download(file)

        except:
            # Unknown slug
            printFail(traceback.print_exc)
            cherrypy.response.status = 404

    @access.public
    @autoDescribeRoute(
        Description('get tiles'))
    @rest.rawResponse
    def tile(self, image_id, level, tfile):
        resp = ""
        printOk("Tile called!")
        try:
            image_id = re.search(r'(.*)_files', image_id).group(1)
            slides = self.load_slides(image_id)
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
            print("done")

        except KeyError:
            # Unknown slug
            print("keyerror")
            cherrypy.response.status = 404

        except ValueError:
            # Invalid level or coordinates
            print("value error")
            cherrypy.response.status = 404
        except Exception as e:
            print(e)
            print('-' * 60)
            traceback.print_exc()
            print('-' * 60)

        return resp
