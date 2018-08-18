import json
import traceback
from io import BytesIO, StringIO

import cherrypy
from bson.json_util import dumps

from girder.api import access, rest
from girder.api.describe import autoDescribeRoute, Description
from girder.api.rest import Resource, setCurrentUser
from girder.constants import AccessType
from girder.models.assetstore import Assetstore
from girder.models.collection import Collection
from girder.models.file import File
from girder.models.upload import Upload
from girder.models.user import User
from girder.utility import RequestBodyStream
from ..bcolors import print_ok, print_fail, print_ok2


class PILBytesIO(BytesIO):
    def fileno(self):
        """Classic PIL doesn't understand io.UnsupportedOperation."""
        raise AttributeError('Not supported')


class LabelResource(Resource):

    def __init__(self):
        super().__init__()
        self.resourceName = 'label'
        self.cp_config = {'tools.staticdir.on': True,
                          'tools.staticdir.index': 'index.html'}
        self.route('GET', (), handler=self.getLabelList)
        self.route('GET', (':label_id',), self.getLabel)
        self.route('POST', (), self.postLabel)
        user = User().authenticate(login="dummy", password="dummy1234")
        setCurrentUser(user)
        self.collection_model = Collection()
        self.collection = self.collection_model.load("5b736cad2a554e4d0f6c937f", user=self.getCurrentUser())
        print_ok(self.collection)

    @access.public
    @autoDescribeRoute(
        Description('Get label list'))
    @rest.rawResponse
    def getLabelList(self):
        print_ok('getLabelsList() was called!')

        try:
            files = self.collection_model.fileList(self.collection, user=self.getCurrentUser(), data=False,
                                                   includeMetadata=True, mimeFilter=['application/json'])
            files = list(files)
            cherrypy.response.headers["Content-Type"] = "application/json"
            return dumps(files)

        except:
            print_fail(traceback.print_exc)

    @access.public
    @autoDescribeRoute(
        Description('Get label by id')
            .param('label_id', 'label file id'))
    @rest.rawResponse
    def getLabel(self, label_id):
        try:
            fileModel = File()
            file = fileModel.load(label_id, level=AccessType.READ, user=self.getCurrentUser())
            cherrypy.response.headers["Content-Type"] = "application/json"
            return fileModel.download(file)
        except:
            # Unknown slug
            print_fail(traceback.print_exc)
            cherrypy.response.status = 404

    @access.public
    @autoDescribeRoute(
        Description('Post label by id')
            .param('label_id', 'label file id'))
    @rest.rawResponse
    def postLabel(self, label_id, params):
        try:
            fileModel = File()
            user = self.getCurrentUser()
            file = fileModel.load(label_id, level=AccessType.WRITE, user=user)
            cherrypy.response.headers["Content-Type"] = "application/json"
            params['labels'] = json.loads(params['labels'])
            j = json.dumps(params, indent=4, sort_keys=True)
            print_ok(j)
            b = str.encode(j)
            stream = BytesIO(b)
            chunk = RequestBodyStream(stream, size=len(b))
            uploadModel = Upload()
            upload = uploadModel.createUploadToFile(file, user, len(b))
            uploadModel.handleChunk(upload, chunk, filter=True, user=user)
            print_ok2(upload)
            return dumps(upload)

        except:
            # Unknown slug
            print_fail(traceback.print_exc)
            cherrypy.response.status = 404