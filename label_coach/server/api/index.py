import cherrypy

from girder.api import access, rest
from girder.constants import AccessType, registerAccessFlag
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, setCurrentUser
import os

from girder.models.collection import Collection
from girder.models.folder import Folder
from girder.models.user import User
from girder.utility.server import staticFile

from girder.utility.plugin_utilities import registerPluginWebroot
from ..bcolors import BColors


class IndexAPIHandler(Resource):

    def __init__(self):
        super().__init__()
        self.resourceName = 'cat'
        self.cp_config = {'tools.staticdir.on': True,
                          'tools.staticdir.index': 'index.html'}
        self.route('GET', (), self.index)
        print("This is index")

    @access.public
    @autoDescribeRoute(
        Description('Find a cat'))
    @rest.rawResponse
    def index(self, params):
        print('params is', params)
        path = os.path.join(self.cp_config['tools.staticdir.dir'], self.cp_config['tools.staticdir.index'])

        return cherrypy.lib.static.serve_file(path)
