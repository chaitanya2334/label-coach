from io import BytesIO

from girder.models.upload import Upload
from girder.utility import RequestBodyStream

from girder.models.file import File
from girder.models.folder import Folder
from girder.models.item import Item


def create_new_file(p_folder, name, user, assetstore):
    """
    create a new file
    :param p_folder: parent folder
    :param name: name of the file you want to create
    :param user: user trying to create this file
    :param assetstore: assetstore where this file is going to be created
    :return: file doc
    """
    item = Item().createItem(name,
                             creator=user,
                             folder=p_folder,
                             description='label file',
                             reuseExisting=False)

    file = File().createFile(size=0,
                             item=item,
                             name=name,
                             creator=user,
                             assetstore=assetstore,
                             mimeType="application/json")
    return file


def find_file(p_folder, name, user, assetstore, create=False):
    """
    Find file by name. If not found create the file.
    :param p_folder: parent folder
    :param name: name of the file
    :param user: user trying to access this file
    :param assetstore: assetstore where this file exists
    :param create: boolean, whether or not to create the file if not found
    :return: file doc or None
    """
    item = list(Item().find({'folderId': p_folder['_id'], 'name': name}).limit(1))
    if not item:
        # check if you are allowed to create, else return nothing
        if create:
            file = create_new_file(p_folder, name, user, assetstore)
        else:
            return None
    else:
        item = item[0]
        file = list(File().find({'itemId': item['_id']}).limit(1))[0]

    return file


def find_folder(p_folder, name, user, desc="", create=False):
    """
    Find folder by name. If not found create the folder

    :param p_folder: parent folder
    :param name: name of the folder you want to find inside the parent folder
    :param user: user trying to access this folder
    :param desc: desc of the folder if we end up creating this folder
    :param create: boolean, whether or not to create this folder if not found
    :return: folder doc or None
    """
    folder = list(Folder().find({'folderId': p_folder['_id'], 'name': name}).limit(1))
    if not folder:
        # check if you are allowed to create, else return nothing
        if create:
            folder = Folder().createFolder(parent=p_folder,
                                           name=name,
                                           creator=user,
                                           description=desc,
                                           reuseExisting=True)
        else:
            return None

    return folder


def copy_file(src_file, dest_file, user):
    upload = Upload().createUploadToFile(dest_file, user, src_file['size'])
    Upload().handleChunk(upload=upload,
                         chunk=RequestBodyStream(File().open(src_file), size=dest_file['size']),
                         user=user)
    return upload


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
