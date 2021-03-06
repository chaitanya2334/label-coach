import cherrypy

from girder.api import access, rest
from girder.constants import AccessType, registerAccessFlag
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource
import os
from girder.utility.server import staticFile

from girder.utility.plugin_utilities import registerPluginWebroot

from .api.label_image import LabelImageResource
from .api.brush_canvas import BrushCanvasResource
from .api.assignment import AssignmentResource
from .api.label import LabelResource
from .api.image import ImageResource
from .api.index import IndexAPIHandler


def load(info):
    index = IndexAPIHandler()
    image = ImageResource()
    label = LabelResource()
    labelImage = LabelImageResource()
    assignment = AssignmentResource()
    brush_canvas = BrushCanvasResource()
    print("asdfasdfsdafasdgsadgasg" + PLUGIN_ROOT_DIR)
    path = os.path.join(PLUGIN_ROOT_DIR, 'web_client/static', 'index.html')
    index.cp_config['tools.staticdir.dir'] = os.path.join(info['pluginRootDir'], 'web_client/static')
    registerPluginWebroot(index, "")
    info['apiRoot'].image = image
    info['apiRoot'].label = label
    info['apiRoot'].assignment = assignment
    info['apiRoot'].brush_canvas = brush_canvas
    info['apiRoot'].labelImage = labelImage



