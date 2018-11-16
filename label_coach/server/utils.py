import functools
import json
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
