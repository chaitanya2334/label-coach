import base64
from collections import defaultdict

import cherrypy
from bson.json_util import dumps
from girder.api import access, rest
from girder.api.describe import autoDescribeRoute, Description
from girder.api.rest import Resource, setContentDisposition, setResponseHeader
from girder.constants import AccessType, TokenScope
from girder.exceptions import RestException
from girder.models.assetstore import Assetstore
from girder.models.collection import Collection
from girder.models.file import File
from girder.models.folder import Folder
from girder.models.item import Item
from girder.models.upload import Upload
from girder.utility import RequestBodyStream, ziputil

from ..bcolors import printOk, printOk2
from ..utils.file_management import writeBytes, find_file, find_folder
from ..utils.generic import trace


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

        self.label_image_folder_name = "LabelImages"

        self.setupRoutes()

    def setupRoutes(self):
        self.route('GET', (), handler=self.getList)
        self.route('POST', (), handler=self.post)
        self.route('GET', ("download",), handler=self.download)

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

    @access.public
    @autoDescribeRoute(
        Description('Create a new label image file if it doesnt exist, else update')
            .param('label_name', 'label name')
            .param('image_name', 'The original image that this belongs to')
            .param('assign_id', 'the assignment folder id')
            .param('image', 'image in string64'))
    @rest.rawResponse
    @trace
    def post(self, label_name, image_name, assign_id, image):
        p_folder = self.folder_m.load(assign_id,
                                      user=self.getCurrentUser(),
                                      level=AccessType.WRITE)

        label_folder = find_folder(p_folder=p_folder,
                                   name=image_name,
                                   user=self.getCurrentUser(),
                                   create=True)

        label_image_folder = find_folder(p_folder=label_folder,
                                         name=self.label_image_folder_name,
                                         user=self.getCurrentUser(),
                                         create=True)
        safe_label_name = label_name.replace("/", "_")
        file_name = ".".join([safe_label_name, 'png'])
        file = find_file(p_folder=label_image_folder,
                         name=file_name,
                         user=self.getCurrentUser(),
                         assetstore=self.asset_m.getCurrent(),
                         create=True)

        # remove data:image/png;base64,
        image = image.split(',')[1]
        image = base64.b64decode(image)
        # image = decode_base64(image)
        upload = writeBytes(self.getCurrentUser(), file, image)
        return dumps({
            "label_image_file": upload['fileId']
        })

    def __downloadFolder(self, folder):
        pass

    @access.public
    @autoDescribeRoute(
        Description("download label images using image id. Returns a stream to the zip file. ")
            .param('assign_id', 'id of the assignment')
            .param('image_name', 'name of the images whose label images you want to download'))
    @rest.rawResponse
    @trace
    def downloadAssignment(self, assign_id):
        assignment = self.folder_m.load(assign_id,
                                        user=self.getCurrentUser(),
                                        level=AccessType.WRITE)
        # find the label image folder

        return self.__downloadFolder(assignment)

    @access.public
    @autoDescribeRoute(
        Description("download the full collection. Returns a stream to the zip file. ")
            .param('assign_id', 'id of the assignment')
            .param('image_name', 'name of the images whose label images you want to download'))
    @rest.rawResponse
    @trace
    def downloadCollection(self):
        collection = list(self.coll_m.list(user=self.getCurrentUser(), offset=0, limit=1))[0]

        # find the label image folder

        return self.__downloadFolder(collection)

    @access.cookie
    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description("download label images using image id. Returns a stream to the zip file. ")
            .param('assign_id', 'id of the assignment')
            .param('image_name', 'name of the images whose label images you want to download')
            .produces('application/zip'))
    @rest.rawResponse
    @trace
    def download(self, assign_id, image_name):

        assignment = self.folder_m.load(assign_id,
                                        user=self.getCurrentUser(),
                                        level=AccessType.READ)

        label_folder = find_folder(p_folder=assignment,
                                   name=image_name,
                                   user=self.getCurrentUser(),
                                   create=True)

        folder = find_folder(p_folder=label_folder,
                             name=self.label_image_folder_name,
                             user=self.getCurrentUser(),
                             create=True)

        printOk(folder)

        setResponseHeader('Content-Type', 'application/zip')
        setContentDisposition(label_folder['name'] + '.zip')
        user = self.getCurrentUser()

        def stream():
            zip = ziputil.ZipGenerator(folder['name'])
            for (path, file) in self.folder_m.fileList(
                    folder, user=user, subpath=False):
                for data in zip.addFile(file, path):
                    yield data
            yield zip.footer()

        return stream
