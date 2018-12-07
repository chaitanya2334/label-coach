import base64
import functools
import json
import re
import traceback
from io import BytesIO
from girder.utility import RequestBodyStream
from girder.models.upload import Upload
from girder.models.file import File
from girder.models.assetstore import Assetstore

from .bcolors import printFail


def writeData(currentUser, file, data):
    stream = BytesIO(str.encode(data))
    chunk = RequestBodyStream(stream, size=len(data))
    upload = Upload().createUploadToFile(file, currentUser, len(data))
    Upload().handleChunk(upload, chunk, filter=True, user=currentUser)
    return upload


def writeBytes(currentUser, file, bytes):
    stream = BytesIO(bytes)
    chunk = RequestBodyStream(stream, size=len(bytes))
    upload = Upload().createUploadToFile(file, currentUser, len(bytes))
    Upload().handleChunk(upload, chunk, filter=True, user=currentUser)
    return upload


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
    data = re.sub(rb'[^a-zA-Z0-9{}]+'.format(altchars), b'', data)  # normalize
    missing_padding = len(data) % 4
    if missing_padding:
        data += b'=' * (4 - missing_padding)
    return base64.b64decode(data, altchars)
