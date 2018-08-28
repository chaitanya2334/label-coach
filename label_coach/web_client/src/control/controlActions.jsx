import {restRequest} from "girder/rest";

export function addAnnotation(ann_type, label_id) {
    return {
        type: 'ADD_ANN',
        ann_type: ann_type,
        label_id: label_id,
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

export function unlockAnnotation(ann_type, label_id, item_id) {
    return {
        type: 'UNLOCK_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id
    }
}

export function updateAnnotation(ann_type, label_id, item_id, points) {
    return {
        type: 'UPDATE_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id,
        points: points
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

export function toggleLabel(label) {
    return {
        type: 'TOGGLE_LABEL',
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
                        getDzi: "api/v1/image/" + image._id.$oid,
                        getThumbnail: "api/v1/image/" + image._id.$oid + "_files/8/0_0.jpeg",
                        labelFileId: labelFileId,
                        title: image.name.replace(/\.[^/.]+$/, "")
                    }
                });
                dispatch(populateImages(images));
            })
    }
}

function postData(url = ``, data = {}) {
    // Default options are marked with *
    console.log(JSON.stringify(data));
    return restRequest({
                           url: url,
                           method: 'POST',
                           data: {
                               labels: JSON.stringify(data)
                           }
                       })
        .then(response => console.log(response)); // parses response to JSON
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

export function createLabelFile(fileName, imageId) {
    return function (dispatch) {
        return restRequest({
                               url: "/label/create",
                               method: 'GET',
                               data: {
                                   file_name: fileName
                               }
                           })
            .then(response => {
                if (typeof response === 'string') {
                    return JSON.parse(response);
                }else{
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

export function postLabels(state) {

    return function (dispatch) {
        let label_id = "";
        for (let image of state.images) {
            if (image.active) {
                label_id = image.labelFileId;
            }
        }
        if (label_id && state.labels.length > 0) {
            postData("label?label_id=" + label_id, state.labels);
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
                    polygons: label.polygons,
                    lines: label.lines,
                }));
                dispatch(replaceLabels(labels));
            });

    }
}