import {restRequest} from "girder/rest";

export function setSize(toolType, value) {
    return {
        type: "SET_SIZE",
        value: value,
        toolType: toolType
    }
}

export function setHeader(state) {
    return {
        type: "SET_HEADER",
        state: state,
    }
}

export function selectRightBar(value) {
    return {
        type: "SELECT_RIGHT_BAR",
        value: value,
    }
}

export function setThumbnailBarVisibility(state) {
    return {
        type: "SET_THUMBNAIL_BAR_VIS",
        state: state,
    }
}

export function selectAllAnnotations(label_id) {
    return {
        type: 'SELECT_ALL_ANN',
        label_id: label_id
    }
}

export function deselectAllAnnotations(label_id) {
    return {
        type: 'DESELECT_ALL_ANN',
        label_id: label_id
    }
}

export function changePage(label_id, page) {
    return {
        type: 'CHANGE_PAGE',
        label_id: label_id,
        page: page,
    }
}

export function selectAnnotation(label_id, ann_type, item_id) {
    return {
        type: 'SELECT_ANN',
        label_id: label_id,
        ann_type: ann_type,
        item_id: item_id,
    }
}

export function deselectAnnotation(label_id, ann_type, item_id) {
    return {
        type: 'DESELECT_ANN',
        label_id: label_id,
        ann_type: ann_type,
        item_id: item_id,
    }
}

export function addAnnotation(ann_type, label_id, item_id, args = {}) {
    return {
        type: 'ADD_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id,
        args: args,
    }
}

export function lockAnnotation(ann_type, label_id, item_id) {
    return {
        type: 'LOCK_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id
    }
}

export function lockAllAnnotations(ann_type) {
    return {
        type: 'LOCK_ALL_ANN',
        ann_type: ann_type
    }
}

export function unlockAnnotation(ann_type, label_id, item_id) {
    return {
        type: 'UNLOCK_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id
    }
}

export function updateAnnotation(ann_type, label_id, item_id, points, args = {}) {
    return {
        type: 'UPDATE_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id,
        points: points,
        args: args,
    }
}

export function deleteAnnotation(ann_type, label_id, item_id) {
    return {
        type: 'DELETE_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id,
    }
}

export function cancelAnnotation(ann_type, label_id) {
    return {
        type: 'CANCEL_ANN',
        ann_type: ann_type,
        label_id: label_id
    }
}

export function toggleLabelButton(label_id, button_type) {
    return {
        type: 'TOGGLE_BUTTON',
        button_type: button_type,
        label_id: label_id,
    };
}

export function selectLabel(label) {
    return {
        type: "SELECT_LABEL",
        label_id: label.id
    }
}

export function expandLabel(label_id, state) {
    return {
        type: 'EXPAND_LABEL',
        label_id: label_id,
        state: state,
    }
}

export function toggleCollapse(label) {
    return {
        type: 'TOGGLE_COLLAPSE',
        label_id: label.id,
    }
}

export function toggleExpand(label) {
    return {
        type: 'TOGGLE_EXPAND',
        label_id: label.id,
    }
}

export function addSearchEntry(text, id) {
    return {
        type: 'ADD_SEARCH_ENTRY',
        id: id,
        search_text: text,
    }
}

export function populateImages(images) {
    return {
        type: 'POPULATE_IMAGES',
        images: images
    }
}

export function replaceLabels(labels) {
    return {
        type: 'REPLACE_LABELS',
        labels: labels
    }
}

export function setCurrentAssignment(assignment) {
    return {
        type: 'SET_CURRENT_ASSIGNMENT',
        assignment: assignment
    }
}

export function fetchCurrentAssignment(id) {
    return function (dispatch) {
        return restRequest({
                               url: "assignment/" + id,
                               method: 'GET',
                               data: {
                                   a_id: id
                               }
                           })
            .then((response) => {
                if (typeof response === 'string') {
                    return JSON.parse(response);
                } else {
                    return response;
                }
            })
            .then((assignment) => {
                dispatch(setCurrentAssignment(assignment));
            })
    }
}

export function fetchImages(id) {
    return function (dispatch) {

        return restRequest({
                               url: "image",
                               method: 'GET',
                               data: {
                                   folderId: id
                               }
                           })
            .then((json) => {
                let images = json.map(image => {
                    let labelFileId = null;
                    if (image.label_id && image.label_id.$oid) {
                        labelFileId = image.label_id.$oid;
                    }
                    return {
                        dbId: image._id.$oid,
                        mimeType: image.mimeType,
                        labelFileId: labelFileId,
                        title: image.name.replace(/\.[^/.]+$/, "")
                    }
                });
                dispatch(populateImages(images));
            })
    }
}

function postData(url = ``, data = {}, callback) {
    // Default options are marked with *
    return restRequest({
                           url: url,
                           method: 'POST',
                           data: {
                               labels: JSON.stringify(data)
                           }
                       })
        .then(response => {
            callback(response)
        }); // parses response to JSON
}

export function selectImage(image_id) {
    return {
        type: 'SELECT_IMAGE',
        image_id: image_id
    }
}

export function addLabelId(image_id, label_id) {
    return {
        type: 'ADD_LABEL_ID',
        image_id: image_id,
        label_id: label_id
    }
}

export function createLabelFile(fileName, folderId, imageId) {
    return function (dispatch) {
        return restRequest({
                               url: "/label/create",
                               method: 'GET',
                               data: {
                                   file_name: fileName,
                                   folder_id: folderId,
                               }
                           })
            .then(response => {
                if (typeof response === 'string') {
                    return JSON.parse(response);
                } else {
                    return response;
                }
            })
            .then(json => {
                // TODO move it out of this action. Not really happy about dispatching this action here.
                let labelId = json.label_id.$oid;
                dispatch(addLabelId(imageId, labelId));
                dispatch(fetchLabels(labelId));
            })
    }
}

export function postLabels(state, callback) {

    return function (dispatch) {
        let label_id = "";
        for (let image of state.images) {
            if (image.active) {
                label_id = image.labelFileId;
            }
        }
        if (label_id && state.labels.length > 0) {
            postData("label?label_id=" + label_id, state.labels, callback);
        }
    }
}

export function fetchLabels(label_id) {
    return function (dispatch) {
        return restRequest({
                               url: "/label/" + label_id,
                               method: 'GET',
                               data: {
                                   label_id: label_id
                               }
                           })
            .then(json => {
                let labels = json.labels;
                labels = labels.map(label => ({
                    name: label.name,
                    color: label.color,
                    ann: label.ann
                }));
                dispatch(replaceLabels(labels));
                dispatch(fetchLabelMeta(label_id, (file) => {
                    dispatch(editSaveIndicatorText("Saved"));
                    dispatch(setLastUpdated(file.created.$date));
                }))
            });

    }
}

export function fetchLabelMeta(label_id, callback) {
    return function (dispatch) {
        return restRequest({
                               url: "/label/meta",
                               method: 'GET',
                               data: {
                                   label_id: label_id
                               }
                           })
            .then(response => JSON.parse(response))
            .then(file => {
                callback(file);
            });
    }
}

export function editSaveIndicatorText(text) {
    return {
        type: 'EDIT_SAVE_INDICATOR_TEXT',
        text: text
    }
}

export function setSaveStatus(status) {
    return {
        type: 'SET_SAVE_STATUS',
        status: status
    }
}

export function setLastUpdated(date) {
    return {
        type: "SET_LAST_UPDATED",
        date: date
    }
}

export function saveLabels(state) {
    return (dispatch) => {
        dispatch(editSaveIndicatorText("Saving ..."));
        dispatch(postLabels(state, (response) => {
            dispatch(editSaveIndicatorText("Saved just now"));
            dispatch(setLastUpdated(new Date(response.updated.$date)));
        }));
    }
}

export function setOutline(state) {
    return {
        type: "SET_OUTLINE",
        state: state,
    }
}