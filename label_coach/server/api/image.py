import re
import traceback

import cherrypy

from girder.api import access, rest
from girder.constants import AccessType, registerAccessFlag
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource
import os
from girder.utility.server import staticFile

from girder.utility.plugin_utilities import registerPluginWebroot
from ..deepzoom import load_slide
from io import BytesIO


class PILBytesIO(BytesIO):
    def fileno(self):
        """Classic PIL doesn't understand io.UnsupportedOperation."""
        raise AttributeError('Not supported')


class ImageResource(Resource):

    def __init__(self):
        super().__init__()
        self.resourceName = 'image'
        self.cp_config = {'tools.staticdir.on': True,
                          'tools.staticdir.index': 'index.html'}
        self.route('GET', (':image_id',), self.dzi)
        self.route('GET', (':tile_id', ':level', ':tfile'), self.tile)
        rel_path = os.path.dirname(os.path.realpath(__file__))
        self.slides, self.associated_images, self.slide_properties, self.slide_mpp = \
            load_slide(os.path.join(rel_path, "../../web_client/static/images/TCGA-CH-5765-11A-01-TS1.2a1faf76-526b-4581-b947-e8d733674df7.svs"))

    @access.public
    @autoDescribeRoute(
        Description('Get dzi'))
    @rest.rawResponse
    def dzi(self, image_id):
        print('getImage() was called!')
        print('params is', image_id)

        try:
            resp = self.slides[image_id].get_dzi('jpeg')
            cherrypy.response.headers["Content-Type"] = "application/xml"
            return resp
        except KeyError:
            # Unknown slug
            cherrypy.response.status = 404

    @access.public
    @autoDescribeRoute(
        Description('get tiles'))
    @rest.rawResponse
    def tile(self, tile_id, level, tfile):
        resp = ""
        try:
            image_id = re.search(r'(.*)_files', tile_id).group(1)
            pos, _format = tfile.split('.')
            col, row = pos.split('_')
            _format = _format.lower()

            if _format != 'jpeg' and _format != 'png':
                # Not supported by Deep Zoom
                cherrypy.response.status = 404

            tile_image = self.slides[image_id].get_tile(int(level), (int(col), int(row)))
            buf = PILBytesIO()
            tile_image.save(buf, _format, quality=100)
            cherrypy.response.headers["Content-Type"] = 'image/%s' % _format
            resp = buf.getvalue()
            print("done")

        except KeyError:
            # Unknown slug
            print("keyerror")
            cherrypy.response.status = 404

        except ValueError:
            # Invalid level or coordinates
            print("value error")
            cherrypy.response.status = 404
        except Exception as e:
            print(e)
            print('-' * 60)
            traceback.print_exc()
            print('-' * 60)

        return resp
