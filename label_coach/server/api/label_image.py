import base64
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
from ..utils import writeData, trace, writeBytes, decode_base64


class LabelImageResource(Resource):

    def __init__(self):
        super().__init__()
        self.resourceName = 'labelImage'

        self.coll_m = Collection()
        self.file_m = File()
        self.folder_m = Folder()
        self.item_m = Item()
        self.upload_m = Upload()
        self.asset_m = Assetstore()

        self.setupRoutes()

    def setupRoutes(self):
        self.route('GET', (), handler=self.getList)
        self.route('GET', (':label_id',), handler=self.get)
        self.route('GET', ('meta',), handler=self.getMeta)
        self.route('GET', ('by_name',), handler=self.getByName)
        self.route('POST', (), handler=self.post)

    def __createNewFile(self, folder, file_name):
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
        Description('Get label Image list'))
    @rest.rawResponse
    @trace
    def getList(self):
        printOk2("get label image called")
        collection = list(self.coll_m.list(user=self.getCurrentUser(), offset=0, limit=1))[0]
        files = self.coll_m.fileList(collection, user=self.getCurrentUser(), data=False,
                                     includeMetadata=True, mimeFilter=['application/png'])
        files = list(files)
        cherrypy.response.headers["Content-Type"] = "application/png"
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

    def __findFile(self, folder, file_name, create=False):
        item = list(self.item_m.find({'folderId': folder['_id'], 'name': file_name}).limit(1))
        if not item:
            # check if you are allowed to create, else return nothing
            if create:
                file = self.__createNewFile(folder, file_name)
            else:
                return None
        else:
            item = item[0]
            file = list(self.file_m.find({'itemId': item['_id']}).limit(1))[0]

        return file

    @access.public
    @autoDescribeRoute(
        Description('Create a new label image file if it doesnt exist, else update')
            .param('label_name', 'label name')
            .param('image_name', 'The original image that this belongs to')
            .param('folder_id', 'the image id')
            .param('image', 'image in string64'))
    @rest.rawResponse
    @trace
    def post(self, label_name, image_name, folder_id, image):
        printOk2("post label image")
        folder = self.folder_m.load(folder_id, user=self.getCurrentUser(), level=AccessType.WRITE)
        file_name = "_".join([label_name, image_name, '.png'])
        file = self.__findFile(folder, file_name, create=True)
        # remove data:image/png;base64,
        image = image.split(',')[1]
        image = base64.b64decode(image)
        # image = decode_base64(image)
        upload = writeBytes(self.getCurrentUser(), file, image)
        return dumps({
            "label_image_file": upload['fileId']
        })

    @access.public
    @autoDescribeRoute(
        Description('Get labels by file_name')
            .param('file_name', 'label file name')
            .param('folder_id', 'the parent folder id'))
    @rest.rawResponse
    @trace
    def getByName(self, label_name, image_name, folder_id):
        folder = self.folder_m.load(folder_id, user=self.getCurrentUser(), level=AccessType.READ)
        file_name = "_".join([label_name, image_name])
        file = self.__findFile(folder, file_name, create=False)
        cherrypy.response.headers["Content-Type"] = "application/png"
        if file:
            return self.file_m.download(file)
        else:
            return dumps({})

    @access.public
    @autoDescribeRoute(
        Description('Get label image by id')
            .param('label_image_id', 'label image file id'))
    @rest.rawResponse
    @trace
    def get(self, label_image_id):
        file = self.file_m.load(label_image_id, level=AccessType.READ, user=self.getCurrentUser())
        cherrypy.response.headers["Content-Type"] = "application/png"
        return self.file_m.download(file)

    @access.public
    @autoDescribeRoute(
        Description('Get label by id')
            .param('label_image_id', 'label file id'))
    @trace
    def getMeta(self, label_image_id):
        file = self.file_m.load(label_image_id, level=AccessType.READ, user=self.getCurrentUser())
        cherrypy.response.headers["Content-Type"] = "application/json"
        return dumps(file)
