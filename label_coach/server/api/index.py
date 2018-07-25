import cherrypy

from girder.api import access, rest
from girder.constants import AccessType, registerAccessFlag
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource
import os
from girder.utility.server import staticFile

from girder.utility.plugin_utilities import registerPluginWebroot


class IndexAPIHandler(Resource):

    def __init__(self):
        super().__init__()
        self.resourceName = 'cat'
        self.cp_config = {'tools.staticdir.on': True,
                          'tools.staticdir.index': 'index.html'}
        self.route('GET', (), self.index)

    @access.public
    @autoDescribeRoute(
        Description('Find a cat'))
    @rest.rawResponse
    def index(self, params):
        print('findCat() was called!')
        print('params is', params)
        path = os.path.join(self.cp_config['tools.staticdir.dir'], self.cp_config['tools.staticdir.index'])
        return cherrypy.lib.static.serve_file(path)
