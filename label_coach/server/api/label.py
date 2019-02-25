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
from ..utils import writeData, trace


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
    @trace
    def getLabelList(self):
        collection = list(self.coll_m.list(user=self.getCurrentUser(), offset=0, limit=1))[0]
        files = self.coll_m.fileList(collection, user=self.getCurrentUser(), data=False,
                                     includeMetadata=True, mimeFilter=['application/json'])
        files = list(files)
        cherrypy.response.headers["Content-Type"] = "application/json"
        return dumps(files)

    @staticmethod
    def getOwnerId(folder):
        aclList = Folder().getFullAccessList(folder)
        for acl in aclList['users']:
            if acl['level'] == AccessType.ADMIN:
                return str(acl['id'])
        return None

    def getConfigFolder(self, label_folder_id):
        label_folder = Folder().load(label_folder_id,
                                     user=self.getCurrentUser(),
                                     level=AccessType.READ)
        ownerId = self.getOwnerId(label_folder)
        config_folder = self.folder_m.load(label_folder['meta'][ownerId], level=AccessType.READ,
                                           user=self.getCurrentUser())
        return config_folder

    def findConfig(self, folder_id):
        folder = self.getConfigFolder(folder_id)
        printOk2("Config folder {}".format(folder))
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
    @trace
    def createLabelFile(self, file_name, folder_id):
        folder = self.folder_m.load(folder_id, user=self.getCurrentUser(), level=AccessType.WRITE)
        file = self.__findFile(folder, file_name)
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

    @access.public
    @autoDescribeRoute(
        Description('Get labels by file_name')
            .param('file_name', 'label file name').param('folder_id', 'the parent folder id'))
    @rest.rawResponse
    @trace
    def getLabelByName(self, file_name, folder_id):
        folder = self.folder_m.load(folder_id, user=self.getCurrentUser(), level=AccessType.READ)
        file = self.__findFile(folder, file_name)
        cherrypy.response.headers["Content-Type"] = "application/json"
        if file:
            return self.file_m.download(file)
        else:
            return dumps({})

    @access.public
    @autoDescribeRoute(
        Description('Get label by id')
            .param('label_id', 'label file id'))
    @rest.rawResponse
    @trace
    def getLabel(self, label_id):
        file = self.file_m.load(label_id, level=AccessType.READ, user=self.getCurrentUser())
        printOk2(file)
        cherrypy.response.headers["Content-Type"] = "application/json"
        return self.file_m.download(file)

    @access.public
    @autoDescribeRoute(
        Description('Get label by id')
            .param('label_id', 'label file id'))
    @trace
    def getLabelMeta(self, label_id):
        file = self.file_m.load(label_id, level=AccessType.READ, user=self.getCurrentUser())
        cherrypy.response.headers["Content-Type"] = "application/json"
        return dumps(file)

    @access.public
    @autoDescribeRoute(
        Description('Post label by id')
            .param('label_id', 'label file id')
            .param('labels', 'labels to be updated'))
    @rest.rawResponse
    @trace
    def postLabel(self, label_id, labels):
        file = self.file_m.load(label_id, level=AccessType.WRITE, user=self.getCurrentUser())
        cherrypy.response.headers["Content-Type"] = "application/json"
        params = {'labels': json.loads(labels)}
        data = json.dumps(params, indent=2, sort_keys=True)
        upload = writeData(self.getCurrentUser(), file, data)
        printOk2(file)
        printOk(upload)
        return dumps(upload)

    @access.public
    @autoDescribeRoute(
        Description('Post label by id')
            .param('label_id', 'label file id'))
    @rest.rawResponse
    def strokeToOutline(self, strokes):
        pass
