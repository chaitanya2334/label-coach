import {fetchImages, replaceLabels} from "../control/controlActions";
import {restRequest} from "girder/rest";

function populateAssignments(assignments) {
    return {
        type: 'POPULATE_ASSIGNMENTS',
        assignments: assignments
    }
}

function updateFolderThumbnails(assignmentId, thumbnails) {
    return {
        type: 'UPDATE_FOLDER_THUMBNAILS',
        assignmentId: assignmentId,
        thumbnails: thumbnails
    }
}

export function selectAssignment(id, history) {
    return (dispatch) => {
        history.push("/tasker/" + id);
    }
}

export function findAssignments() {
    return function (dispatch) {
        return restRequest({
                               url: "/assignment/",
                               method: "GET",
                               data: {
                                   limit: 50,
                               }
                           }).then(assignments=>{
                               if(assignments.length > 0){
                                   dispatch(populateAssignments(assignments));
                               }else{
                                   console.error("No assignments found!!!!");
                               }

        })
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

export function fetchThumbnails(assignmentId, folderId, n) {
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
                dispatch(updateFolderThumbnails(assignmentId, thumbnails))
            })
    }
}