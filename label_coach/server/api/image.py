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
from ..bcolors import print_ok, print_fail, print_ok2
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
        self.route('GET', (':image_id', ':level', ':tfile'), self.tile)
        user = User().authenticate(login="dummy", password="dummy1234")
        setCurrentUser(user)
        self.collection_model = Collection()
        self.collection = list(self.collection_model.list(user=self.getCurrentUser(), limit=1))[0]
        print_ok(self.collection)

    def load_slides(self, image_id):
        user = User().authenticate(login="dummy", password="dummy1234")
        setCurrentUser(user)
        file = File().load(image_id, level=AccessType.READ, user=self.getCurrentUser())
        assetstore = Assetstore().load(file['assetstoreId'])
        slides, associated_images, slide_properties, slide_mpp = \
            load_slide(os.path.join(assetstore['root'], file['path']))

        return slides

    def find_label_id(self, name):
        labels = self.collection_model.fileList(self.collection, user=self.getCurrentUser(), data=False,
                                                includeMetadata=True, mimeFilter=['application/json'])
        for labelname, label in labels:
            labelname = os.path.splitext(labelname)[0]
            print_ok2("labelname: " + labelname)
            if labelname == name:
                return label['_id']

    @access.public
    @autoDescribeRoute(
        Description('Get image list'))
    @rest.rawResponse
    def getImageList(self):
        print_ok('getImageList() was called!')

        try:
            user = User().authenticate(login="dummy", password="dummy1234")
            setCurrentUser(user)
            print_ok(self.getCurrentUser())
            print_ok(self.collection)
            files = self.collection_model.fileList(self.collection, user=self.getCurrentUser(), data=False,
                                                   includeMetadata=True, mimeFilter=['application/octet-stream'])

            ret_files = []
            for filename, file in files:
                filename = os.path.splitext(filename)[0]
                print_ok("filename: " + filename)
                file['label_id'] = self.find_label_id(filename)
                ret_files.append(file)

            cherrypy.response.headers["Content-Type"] = "application/json"
            return dumps(ret_files)

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
    def tile(self, image_id, level, tfile):
        resp = ""
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
