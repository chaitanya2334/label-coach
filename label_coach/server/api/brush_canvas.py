from io import BytesIO

import cherrypy
from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, getCurrentToken
from girder.constants import AccessType
from girder.models.assetstore import Assetstore
from girder.models.file import File
from girder.models.folder import Folder
from girder.models.item import Item
from girder.models.user import User

from ..bcolors import printOk2
from ..utils.file_management import writeBytes


class BrushCanvasResource(Resource):

    def __init__(self):
        super().__init__()
        self.resourceName = 'brush_canvas'
        self.cp_config = {'tools.staticdir.on': True,
                          'tools.staticdir.index': 'index.html'}
        self.route('POST', ('upload',), handler=self.upload)
        self.route('GET', ('get',), handler=self.get)

    @access.public
    @autoDescribeRoute(
        Description('upload a base64 image that represents a single brush stroke for the given label id')
            .param('folder_id', 'Label folder id the brush stroke corresponds to', required=False)
            .param('label_id', 'Label id the brush stroke corresponds to')
            .param('brush_id', 'brush index')
            .param('svgString', 'svg Image to be saved'))
    def upload(self, folder_id, label_id, brush_id, svgString):
        printOk2("On upload")

        buf = BytesIO(svgString.encode())
        folder = Folder().load(folder_id, user=self.getCurrentUser(), level=AccessType.WRITE)
        brushFile = self.__findFile(folder, "brush_canvas_label_{}_brush_{}.svg".format(label_id, brush_id))

        if not brushFile:
            item = Item().createItem(name="brush_canvas_label_{}_brush_{}.svg".format(label_id, brush_id),
                                     creator=self.getCurrentUser(),
                                     folder=Folder().load(folder_id, level=AccessType.WRITE, user=self.getCurrentUser())
                                     )

            brushFile = File().createFile(size=0,
                                          item=item,
                                          name="brush_canvas_label_{}_brush_{}.svg".format(label_id, brush_id),
                                          creator=self.getCurrentUser(),
                                          assetstore=Assetstore().getCurrent(),
                                          mimeType="image/svg+xml")

        upload = writeBytes(self.getCurrentUser(), brushFile, buf.getvalue())
        return upload

    @access.public
    @autoDescribeRoute(
        Description('get the brush image pointed to by file_id')
            .param('file_id', 'id to the file'))
    def get(self, file_id):
        token = getCurrentToken(allowCookie=True)
        user = User().load(token['userId'], force=True)
        file = File().load(file_id, level=AccessType.READ, user=user)
        cherrypy.response.headers["Content-Type"] = "image/svg+xml"
        return File().download(file)

    @staticmethod
    def __findFile(folder, file_name):
        item = list(Item().find({'folderId': folder['_id'], 'name': file_name}).limit(1))
        if not item:
            return None

        item = item[0]
        file = list(File().find({'itemId': item['_id']}).limit(1))

        if not file:
            return None

        return file[0]
