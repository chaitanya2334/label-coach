import base64
import functools
import re
import traceback
from io import BytesIO

from girder.models.assetstore import Assetstore
from girder.models.file import File

from ..bcolors import printFail


def createThumbnail(currentUser, item):
    thumbnailFile = File().createFile(size=0,
                                      item=item,
                                      name=item['name'] + ".tmb.jpg",
                                      creator=currentUser,
                                      assetstore=Assetstore().getCurrent(),
                                      mimeType="application/jpeg")


def trace(func):
    @functools.wraps(func)
    def wrapper_decorator(*args, **kwargs):
        try:
            value = func(*args, **kwargs)
            # Do something after
            return value
        except Exception as e:
            printFail(traceback.print_exc)

    return wrapper_decorator


class PILBytesIO(BytesIO):
    def fileno(self):
        """Classic PIL doesn't understand io.UnsupportedOperation."""
        raise AttributeError('Not supported')


def decode_base64(data, altchars=b'+/'):
    """Decode base64, padding being optional.

    :param data: Base64 data as an ASCII byte string
    :returns: The decoded byte string.

    """
    data = re.sub(r'[^a-zA-Z0-9{}]+'.format(altchars), '', data)  # normalize
    missing_padding = len(data) % 4
    if missing_padding:
        data += '=' * (4 - missing_padding)
    return base64.b64decode(data, altchars)
