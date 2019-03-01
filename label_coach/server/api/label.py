import json

import cherrypy
from bson.json_util import dumps
from girder.api import access, rest
from girder.api.describe import autoDescribeRoute, Description
from girder.api.rest import Resource
from girder.constants import AccessType
from girder.models.assetstore import Assetstore
from girder.models.collection import Collection
from girder.models.file import File
from girder.models.folder import Folder
from girder.models.item import Item
from girder.models.upload import Upload

from ..bcolors import printOk, printFail, printOk2
from ..error import errorMessage
from ..utils.file_management import writeData, find_folder, find_file, create_new_file, copy_file
from ..utils.generic import trace


class LabelResource(Resource):

    def __init__(self):
        super().__init__()
        self.resourceName = 'label'

        self.ann_file_name = "annotation.json"

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

    # ############# PUBLIC METHODS ##################

    @access.public
    @autoDescribeRoute(
        Description('Get label list').param('assign_id', 'assignment folder id'))
    @rest.rawResponse
    @trace
    def getLabelList(self, assign_id):
        files = self.folder_m.fileList(assign_id, user=self.getCurrentUser(), data=False,
                                       includeMetadata=True, mimeFilter=['application/json'])
        files = list(files)
        cherrypy.response.headers["Content-Type"] = "application/json"
        return dumps(files)

    @access.public
    @autoDescribeRoute(
        Description('Create a new label file inside the label folder if it doesnt exist')
            .param('assign_id', 'the parent folder id')
            .param('name', 'image name for which we are creating this label file'))
    @rest.rawResponse
    @trace
    def createLabelFile(self, assign_id, name):
        p_folder = self.folder_m.load(id=assign_id,
                                      user=self.getCurrentUser(),
                                      level=AccessType.WRITE)

        label_folder = find_folder(p_folder=p_folder,
                                   name=name,
                                   user=self.getCurrentUser(),
                                   desc="Label Folder",
                                   create=True)

        file = find_file(p_folder=label_folder,
                         name=self.ann_file_name,
                         user=self.getCurrentUser(),
                         assetstore=self.asset_m.getCurrent(),
                         create=False)

        if not file:
            file = create_new_file(p_folder=label_folder,
                                   name=self.ann_file_name,
                                   user=self.getCurrentUser(),
                                   assetstore=self.asset_m.getCurrent())

            config_file = self.__find_config(assign_id)

            if not config_file:
                printFail("No config file found")
                return errorMessage("No config file found")
            else:
                res = copy_file(src_file=config_file,
                                dest_file=file,
                                user=self.getCurrentUser())
                return dumps({
                    "label_id": res['fileId']
                })

        return dumps({
            "label_id": file['_id']
        })

    @access.public
    @autoDescribeRoute(
        Description('Get labels by file_name')
            .param('name', 'label file name')
            .param('assign_id', 'the assignment id'))
    @rest.rawResponse
    @trace
    def getLabelByName(self, name, assign_id):
        p_folder = self.folder_m.load(assign_id,
                                      user=self.getCurrentUser(),
                                      level=AccessType.READ)

        label_folder = find_folder(p_folder=p_folder,
                                   name=name,
                                   user=self.getCurrentUser(),
                                   desc="Label Folder",
                                   create=True)

        # this file is created in <assign_folder>/<label_folder>/assignment.json
        file = find_file(p_folder=label_folder,
                         name=self.ann_file_name,
                         user=self.getCurrentUser(),
                         assetstore=self.asset_m.getCurrent(),
                         create=False)

        cherrypy.response.headers["Content-Type"] = "application/json"
        if file:
            return self.file_m.download(file)
        else:
            return dumps({})

    @access.public
    @autoDescribeRoute(
        Description('Get label file by id')
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
        Description('Get label meta data by id')
            .param('label_id', 'label file id'))
    @trace
    def getLabelMeta(self, label_id):
        file = self.file_m.load(label_id, level=AccessType.READ, user=self.getCurrentUser())
        cherrypy.response.headers["Content-Type"] = "application/json"
        return dumps(file)

    @access.public
    @autoDescribeRoute(
        Description('Post to label file by id')
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

    # ############# PRIVATE METHODS ##################

    def __create_new_file(self, folder, file_name):
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

    @staticmethod
    def __get_owner_id(folder):
        aclList = Folder().getFullAccessList(folder)
        for acl in aclList['users']:
            if acl['level'] == AccessType.ADMIN:
                return str(acl['id'])
        return None

    def __get_config_folder(self, label_folder_id):
        label_folder = Folder().load(label_folder_id,
                                     user=self.getCurrentUser(),
                                     level=AccessType.READ)
        ownerId = self.__get_owner_id(label_folder)
        config_folder = self.folder_m.load(label_folder['meta'][ownerId], level=AccessType.READ,
                                           user=self.getCurrentUser())
        return config_folder

    def __find_config(self, folder_id):
        folder = self.__get_config_folder(folder_id)
        printOk2("Config folder {}".format(folder))
        files = self.folder_m.fileList(folder, self.getCurrentUser(), data=False)
        for file_path, file in files:
            printOk(file)
            if file['name'] == "config.json":
                return file

    def __findFolder(self, p_folder, name, desc="", create=False):
        """
        Find folder by name. If not found create the folder
        :param p_folder: parent folder
        :param name: name of the folder you want to find inside the parent folder
        :return: folder doc
        """
        folder = list(self.folder_m.find({'folderId': p_folder['_id'], 'name': name}).limit(1))
        if not folder:
            # check if you are allowed to create, else return nothing
            if create:
                folder = self.folder_m.createFolder(parent=p_folder,
                                                    name=name,
                                                    creator=self.getCurrentUser(),
                                                    description=desc,
                                                    reuseExisting=True)
            else:
                return None

        return folder

    def __findFile(self, folder, file_name):
        item = list(self.item_m.find({'folderId': folder['_id'], 'name': file_name}).limit(1))
        if not item:
            return None

        item = item[0]
        file = list(self.file_m.find({'itemId': item['_id']}).limit(1))

        if not file:
            return None

        return file[0]
