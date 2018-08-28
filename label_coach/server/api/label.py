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
from girder.models.folder import Folder
from girder.models.item import Item
from girder.models.upload import Upload
from girder.models.user import User
from girder.utility import RequestBodyStream

from ..error import errorMessage
from ..bcolors import printOk, printFail, print_ok2


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
        self.route('GET', ('create',), self.createLabelFile)
        self.route('POST', (), self.postLabel)

    def get_root_folder(self):
        collection_model = Collection()
        collection = list(collection_model.list(user=self.getCurrentUser(), offset=0, limit=1))[0]
        return list(Folder().find({'parentId': collection['_id']}))[0]

    def write_to_file(self, file, data):
        j = json.dumps(data, indent=2, sort_keys=True)
        stream = BytesIO(str.encode(j))
        chunk = RequestBodyStream(stream, size=len(j))
        uploadModel = Upload()
        upload = uploadModel.createUploadToFile(file, self.getCurrentUser(), len(j))
        uploadModel.handleChunk(upload, chunk, filter=True, user=self.getCurrentUser())
        return upload

    def createNewFile(self, file_name):
        parent_folder = self.get_root_folder()
        item = Item().createItem(file_name,
                                 creator=self.getCurrentUser(),
                                 folder=parent_folder,
                                 description='label file',
                                 reuseExisting=False)

        file = File().createFile(creator=self.getCurrentUser(), item=item, name=file_name,
                                 assetstore=Assetstore().getCurrent(), size=0, mimeType="application/json")
        return file

    def copy(self, srcFile, destFile):
        upload = Upload().createUploadToFile(destFile, self.getCurrentUser(), srcFile['size'])
        Upload().handleChunk(upload, RequestBodyStream(File().open(srcFile), size=destFile['size']),
                             user=self.getCurrentUser())
        return upload

    @access.public
    @autoDescribeRoute(
        Description('Get label list'))
    @rest.rawResponse
    def getLabelList(self):
        printOk('getLabelsList() was called!')

        try:
            collection_model = Collection()
            collection = list(collection_model.list(user=self.getCurrentUser(), offset=0, limit=1))[0]
            files = collection_model.fileList(collection, user=self.getCurrentUser(), data=False,
                                              includeMetadata=True, mimeFilter=['application/json'])
            files = list(files)
            cherrypy.response.headers["Content-Type"] = "application/json"
            return dumps(files)

        except:
            printFail(traceback.print_exc)


    @access.public
    @autoDescribeRoute(
        Description('Create a new label file if it doesnt exist')
            .param('file_name', 'label file name'))
    @rest.rawResponse
    def createLabelFile(self, file_name):
        try:
            file = list(File().find({'name': file_name}).limit(1))
            print(file)
            if not file:
                file = self.createNewFile(file_name)
                config_file = list(File().find({'name': "config.json"}).limit(1))
                if not config_file:
                    printFail("No config file found")
                    return errorMessage("No config file found")
                else:
                    config_file = config_file[0]
                    printOk(config_file)
                    res = self.copy(config_file, file)
                    printOk(res['fileId'])
                    return dumps({
                        "label_id": res['fileId']
                    })

            return dumps({
                "label_id": file[0]['_id']
            })
        except:
            printFail(traceback.print_exc)
            cherrypy.response.status = 500

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
            printFail(traceback.print_exc)
            cherrypy.response.status = 404

    @access.public
    @autoDescribeRoute(
        Description('Post label by id')
            .param('label_id', 'label file id'))
    @rest.rawResponse
    def postLabel(self, label_id, params):
        try:
            fileModel = File()
            file = fileModel.load(label_id, level=AccessType.WRITE, user=self.getCurrentUser())
            cherrypy.response.headers["Content-Type"] = "application/json"
            params['labels'] = json.loads(params['labels'])
            upload = self.write_to_file(file, params)
            print_ok2(upload)
            return dumps(upload)

        except:
            # Unknown slug
            printFail(traceback.print_exc)
            cherrypy.response.status = 404
