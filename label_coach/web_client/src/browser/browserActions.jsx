import {fetchImages, replaceLabels} from "../control/controlActions";
import {restRequest} from "girder/rest";

function resetAssignments() {
    return {
        type: "RESET_ASSIGNMENTS"
    }
}

function pushAssignments(assignments) {
    return {
        type: 'PUSH_ASSIGNMENTS',
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

export function setHasMoreAssignments(state){
    return {
        type: "SET_HAS_MORE_ASSIGNMENTS",
        state: state,
    }
}

export function findAssignments(limit, page) {
    return function (dispatch) {
        return restRequest({
                               url: "/assignment/",
                               method: "GET",
                               data: {
                                   limit: limit,
                                   offset: page*limit,
                               }
                           })
            .then(assignments => {
                if (assignments.length > 0) {
                    if (page === 0) {
                        dispatch(resetAssignments());
                        dispatch(pushAssignments(assignments));
                    } else {
                        dispatch(pushAssignments(assignments));
                    }

                    dispatch(setHasMoreAssignments(true));

                } else {
                    dispatch(setHasMoreAssignments(false));
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
                                   limit: 20,
                                   offset: 0
                               }
                           })
            .then(files => {
                let thumbnails = files.sort(() => .5 - Math.random())
                                      .slice(0, n);
                dispatch(updateFolderThumbnails(assignmentId, thumbnails))
            })
    }
}