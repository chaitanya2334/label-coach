import {fetchImages, replaceLabels} from "../control/controlActions";
import {restRequest} from "girder/rest";

function populateFolders(folders) {
    return {
        type: 'POPULATE_FOLDERS',
        folders: folders
    }
}

function updateFolderThumbnails(folderId, thumbnails){
    return {
        type: 'UPDATE_FOLDER_THUMBNAILS',
        folderId: folderId,
        thumbnails: thumbnails
    }
}

export function selectCollection(id, history){
    return (dispatch)=>{
        history.push("/tasker/" + id);
    }
}

export function fetchFolders(id) {
    return function (dispatch) {
        return restRequest({
                               url: "/folder/",
                               method: 'GET',
                               data: {
                                   parentId: id,
                                   parentType: "collection",
                                   limit: 50
                               }
                           })
            .then(json => {

                let folders = json.map(folder => ({
                    name: folder.name,
                    objId: folder._id,
                    created: folder.created,
                    updated: folder.updated
                }));
                dispatch(populateFolders(folders));
            });

    }
}

export function fetchThumbnails(folderId, n) {
    return function (dispatch) {
        return restRequest({
                               url: "/image/",
                               method: 'GET',
                               data: {
                                   folderId: folderId,
                               }
                           })
            .then(files => {
                let thumbnails = files.sort(() => .5 - Math.random())
                                      .slice(0, n);
                dispatch(updateFolderThumbnails(folderId, thumbnails))
            })
    }
}