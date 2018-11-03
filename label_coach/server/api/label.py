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
from ..bcolors import printOk, printFail, printOk2


class PILBytesIO(BytesIO):
    def fileno(self):
        """Classic PIL doesn't understand io.UnsupportedOperation."""
        raise AttributeError('Not supported')


class LabelResource(Resource):

    def __init__(self):
        super().__init__()
        self.resourceName = 'label'

        self.coll_m = Collection()
        self.file_m = File()
        self.folder_m = Folder()
        self.item_m = Item()
        self.upload_m = Upload()
        self.asset_m = Assetstore()

        self.setupRoutes()

    def setupRoutes(self):
        self.route('GET', (), handler=self.getLabelList)
        self.route('GET', (':label_id',), self.getLabel)
        self.route('GET', ('meta',), self.getLabelMeta)
        self.route('GET', ('create',), self.createLabelFile)
        self.route('GET', ('by_name',), self.getLabelByName)
        self.route('POST', (), self.postLabel)

    def writeToFile(self, file, data):
        j = json.dumps(data, indent=2, sort_keys=True)
        stream = BytesIO(str.encode(j))
        chunk = RequestBodyStream(stream, size=len(j))
        upload = self.upload_m.createUploadToFile(file, self.getCurrentUser(), len(j))
        self.upload_m.handleChunk(upload, chunk, filter=True, user=self.getCurrentUser())
        return upload

    def createNewFile(self, folder, file_name):
        item = self.item_m.createItem(file_name,
                                      creator=self.getCurrentUser(),
                                      folder=folder,
                                      description='label file',
                                      reuseExisting=False)

        file = self.file_m.createFile(size=0,
                                      item=item,
                                      name=file_name,
                                      creator=self.getCurrentUser(),
                                      assetstore=self.asset_m.getCurrent(),
                                      mimeType="application/json")
        return file

    def copy(self, srcFile, destFile):
        upload = self.upload_m.createUploadToFile(destFile, self.getCurrentUser(), srcFile['size'])
        self.upload_m.handleChunk(upload=upload,
                                  chunk=RequestBodyStream(self.file_m.open(srcFile), size=destFile['size']),
                                  user=self.getCurrentUser())
        return upload

    @access.public
    @autoDescribeRoute(
        Description('Get label list'))
    @rest.rawResponse
    def getLabelList(self):
        printOk('getLabelsList() was called!')

        try:
            collection = list(self.coll_m.list(user=self.getCurrentUser(), offset=0, limit=1))[0]
            files = self.coll_m.fileList(collection, user=self.getCurrentUser(), data=False,
                                         includeMetadata=True, mimeFilter=['application/json'])
            files = list(files)
            cherrypy.response.headers["Content-Type"] = "application/json"
            return dumps(files)

        except:
            printFail(traceback.print_exc)

    def getConfigFolder(self, label_folder_id):
        label_folder = Folder().load(label_folder_id,
                                     user=self.getCurrentUser(),
                                     level=AccessType.READ)
        creatorId = str(label_folder['creatorId'])
        config_folder = self.folder_m.load(label_folder['meta'][creatorId], level=AccessType.READ,
                                           user=self.getCurrentUser())
        return config_folder

    def findConfig(self, folder_id):
        folder = self.getConfigFolder(folder_id)
        files = self.folder_m.fileList(folder, self.getCurrentUser(), data=False)
        for file_path, file in files:
            printOk(file)
            if file['name'] == "config.json":
                return file

    def __findFile(self, folder, file_name):
        item = list(self.item_m.find({'folderId': folder['_id'], 'name': file_name}).limit(1))
        if not item:
            return None

        item = item[0]
        file = list(self.file_m.find({'itemId': item['_id']}).limit(1))

        if not file:
            return None

        return file[0]

    @access.public
    @autoDescribeRoute(
        Description('Create a new label file if it doesnt exist')
            .param('file_name', 'label file name').param('folder_id', 'the parent folder id'))
    @rest.rawResponse
    def createLabelFile(self, file_name, folder_id):
        try:

            folder = self.folder_m.load(folder_id, user=self.getCurrentUser(), level=AccessType.READ)
            file = self.__findFile(folder, file_name)
            printOk2(file)
            if not file:
                file = self.createNewFile(folder, file_name)
                config_file = self.findConfig(folder_id)
                if not config_file:
                    printFail("No config file found")
                    return errorMessage("No config file found")
                else:
                    res = self.copy(config_file, file)
                    return dumps({
                        "label_id": res['fileId']
                    })

            return dumps({
                "label_id": file['_id']
            })
        except:
            printFail(traceback.print_exc)
            cherrypy.response.status = 500

    @access.public
    @autoDescribeRoute(
        Description('Get labels by file_name')
            .param('file_name', 'label file name').param('folder_id', 'the parent folder id'))
    @rest.rawResponse
    def getLabelByName(self, file_name, folder_id):
        try:
            folder = self.folder_m.load(folder_id, user=self.getCurrentUser(), level=AccessType.READ)
            file = self.__findFile(folder, file_name)
            cherrypy.response.headers["Content-Type"] = "application/json"
            return self.file_m.download(file)
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
            file = self.file_m.load(label_id, level=AccessType.READ, user=self.getCurrentUser())
            cherrypy.response.headers["Content-Type"] = "application/json"
            return self.file_m.download(file)
        except:
            # Unknown slug
            printFail(traceback.print_exc)
            cherrypy.response.status = 404

    @access.public
    @autoDescribeRoute(
        Description('Get label by id')
            .param('label_id', 'label file id'))
    def getLabelMeta(self, label_id):
        try:
            file = self.file_m.load(label_id, level=AccessType.READ, user=self.getCurrentUser())
            cherrypy.response.headers["Content-Type"] = "application/json"
            return dumps(file)
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
            file = self.file_m.load(label_id, level=AccessType.WRITE, user=self.getCurrentUser())
            cherrypy.response.headers["Content-Type"] = "application/json"
            params['labels'] = json.loads(params['labels'])
            upload = self.writeToFile(file, params)
            printOk2(file)
            printOk(upload)
            return dumps(upload)

        except:
            # Unknown slug
            printFail(traceback.print_exc)
            cherrypy.response.status = 404

    @access.public
    @autoDescribeRoute(
        Description('Post label by id')
            .param('label_id', 'label file id'))
    @rest.rawResponse
    def strokeToOutline(self, strokes):
        pass
