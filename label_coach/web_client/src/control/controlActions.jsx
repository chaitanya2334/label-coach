import {restRequest} from "girder/rest";
import {createAsyncAction} from 'redux-promise-middleware-actions';

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

export function addBrushAnnotation(label_id, item_id) {
    return {
        type: 'ADD_BRUSH_ANN',
        ann_type: "brushes",
        label_id: label_id,
        item_id: item_id
    }
}


export function updateBrushAnnotation(label_id, brush_id, fileId, transform) {
    return {
        type: 'UPDATE_BRUSH_ANN',
        label_id: label_id,
        ann_type: "brushes",
        item_id: brush_id,
        file_id: fileId,
        transform: transform
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

export function replaceAnnotation(ann_type, label_id, item_id, args = {}) {
    return {
        type: 'REPLACE_ANN',
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

export function updateAnnotation(ann_type, label_id, item_id, path, args = {}) {
    return {
        type: 'UPDATE_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id,
        path: path,
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

export function pushImages(images) {
    return {
        type: 'PUSH_IMAGES',
        images: images
    }
}

export function resetImages() {
    return {
        type: 'RESET_IMAGES'
    }
}

export function setHasMoreImages(state) {
    return {
        type: 'SET_HAS_MORE_IMAGES',
        state: state
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

export function getCurrentAssignment(id) {
    return {
        type: 'FETCH_CURRENT_ASSIGNMENT',
        payload: restRequest({
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
    }
}

export function fetchCurrentAssignment(id) {
    return function (dispatch) {
        return dispatch(getCurrentAssignment(id))
            .then((response) => {
                let assignment = response.value;
                dispatch(setCurrentAssignment(assignment));
            })
    }
}

export function getImages(id, limit, page) {
    return {
        type: 'FETCH_IMAGES',
        payload: restRequest({
                                 url: "image",
                                 method: 'GET',
                                 data: {
                                     folderId: id,
                                     limit: limit,
                                     offset: page * limit,
                                 }
                             })
            .then(json => {
                return json.map(image => {
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
            })
    }
}

export function fetchImages(id, limit, page) {
    return function (dispatch) {

        return dispatch(getImages(id, limit, page))
            .then(response => {
                let images = response.value;
                console.log(images);
                if (images.length > 0) {
                    if (page === 0) {
                        dispatch(pushImages(images));
                    } else {
                        dispatch(pushImages(images));
                    }

                    dispatch(setHasMoreImages(true));

                } else {
                    dispatch(setHasMoreImages(false));
                    console.error("No More Images found!!!!");
                }
            })
    }
}

function postData(url = ``, data = {}, callback = () => {
}) {
    // Default options are marked with *
    return restRequest({
                           url: url,
                           method: 'POST',
                           data: data
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

export function getLabelFile(fileName, folderId) {
    return {
        type: 'FETCH_LABEL_FILE',
        payload: restRequest({
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
    }
}

export function createLabelFile(fileName, folderId, imageId) {
    return function (dispatch) {
        console.log("folder id before create label_file: ", folderId);
        return dispatch(getLabelFile(fileName, folderId))
            .then(response => {
                let json = response.value;
                // TODO move it out of this action. Not really happy about dispatching this action here.
                let labelId = json.label_id.$oid;
                dispatch(addLabelId(imageId, labelId));
                dispatch(fetchLabels(labelId));
            })
    }
}

export function postLabels(images, labels, callback) {

    return function (dispatch) {
        let label_id = "";
        for (let image of images) {
            if (image.active) {
                label_id = image.labelFileId;
            }
        }
        if (label_id && labels.length > 0) {
            postData("label?label_id=" + label_id, {labels: JSON.stringify(labels)}, callback);
        }
    }
}

export function postLabelImage(labelName, imageName, folderId, labelImg) {

    return (dispatch) => {
        postData("labelImage",
                 {label_name: labelName, image_name: imageName, folder_id: folderId, image: labelImg});
    }
}

export function getLabels(label_id) {
    return {
        type: 'FETCH_LABELS',
        payload: restRequest({
                                 url: "/label/" + label_id,
                                 method: 'GET',
                                 data: {
                                     label_id: label_id
                                 }
                             })
    }
}

export function fetchLabels(label_id) {
    return function (dispatch) {
        return dispatch(getLabels(label_id))
            .then(response => {
                let json = response.value;
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

export function setDoneStatus() {
    return {
        type: 'SET_DONE_STATUS',
    }
}

export function setDirtyStatus() {
    return {
        type: 'SET_DIRTY_STATUS',
    }
}

export function setLastUpdated(date) {
    return {
        type: "SET_LAST_UPDATED",
        date: date
    }
}

export function saveLabels(images, labels) {
    return (dispatch) => {
        dispatch(editSaveIndicatorText("Saving ..."));
        dispatch(postLabels(images, labels, (response) => {
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

export function setNavState(state) {
    return {
        type: "SET_NAV_STATE",
        state: state,
    }
}

export function imageIsReady() {
    return {
        type: "IMAGE_READY"
    }
}

export function imageNotReady() {
    return {
        type: "IMAGE_NOT_READY"
    }
}
