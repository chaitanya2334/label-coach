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
from ..bcolors import print_ok, print_fail
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
        self.route('GET', (':image_id',), self.dzi)
        self.route('GET', (':image_id', ':tile_id', ':level', ':tfile'), self.tile)
        user = User().authenticate(login="dummy", password="dummy1234")
        setCurrentUser(user)
        self.collection_model = Collection()
        self.collection = self.collection_model.load("5b736cad2a554e4d0f6c937f", user=self.getCurrentUser())
        print_ok(self.collection)

    def load_slides(self, image_id):
        file = File().load(image_id, level=AccessType.READ, user=self.getCurrentUser())
        assetstore = Assetstore().load(file['assetstoreId'])
        slides, associated_images, slide_properties, slide_mpp = \
            load_slide(os.path.join(assetstore['root'], file['path']))

        return slides

    @access.public
    @autoDescribeRoute(
        Description('Get image list'))
    @rest.rawResponse
    def getImageList(self):
        print_ok('getImageList() was called!')

        try:
            files = self.collection_model.fileList(self.collection, user=self.getCurrentUser(), data=False,
                                                   includeMetadata=True, mimeFilter=['application/octet-stream'])
            files = list(files)
            cherrypy.response.headers["Content-Type"] = "application/json"
            return dumps(files)

        except:
            print_fail(traceback.print_exc)

    @access.public
    @autoDescribeRoute(
        Description('Get dzi')
            .param('image_id', 'image file id'))
    @rest.rawResponse
    def dzi(self, image_id):
        print_ok('getImage() was called!')
        print_ok('params is ' + image_id)

        try:
            slides = self.load_slides(image_id)

            resp = slides['slide'].get_dzi('jpeg')
            cherrypy.response.headers["Content-Type"] = "application/xml"
            return resp

        except:
            # Unknown slug
            print_fail(traceback.print_exc)
            cherrypy.response.status = 404

    @access.public
    @autoDescribeRoute(
        Description('get tiles'))
    @rest.rawResponse
    def tile(self, image_id, tile_id, level, tfile):
        resp = ""
        try:
            slides = self.load_slides(image_id)
            slide_id = re.search(r'(.*)_files', tile_id).group(1)
            pos, _format = tfile.split('.')
            col, row = pos.split('_')
            _format = _format.lower()

            if _format != 'jpeg' and _format != 'png':
                # Not supported by Deep Zoom
                cherrypy.response.status = 404

            tile_image = slides[slide_id].get_tile(int(level), (int(col), int(row)))
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
