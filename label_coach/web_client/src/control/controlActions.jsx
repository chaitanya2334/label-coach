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

export function populateLabels(labels){
    return {
        type: 'POPULATE_LABELS',
        labels: labels
    }
}

export function fetchImages() {
    return function (dispatch) {
        return fetch("/api/v1/image")
            .then(response => response.json())
            .then((json) => {

                let images = json.map(image_tuple => {
                    let image = image_tuple[1];
                    return {
                        getDzi: "api/v1/image/" + image._id.$oid,
                        getThumbnail: "api/v1/image/" + image._id.$oid + "/slide_files/8/0_0.jpeg",
                        title: image.name
                    }
                });
                dispatch(populateImages(images));
            })
    }
}

export function fetchLabels(label_id) {
    return function (dispatch) {
        return fetch("/api/v1/label/" + label_id)
            .then(response => response.json())
            .then(json => {
                let labels = json.labels;
                labels = labels.map(label => ({
                    text: label.text,
                    color: label.color,
                    polygons: label.polygons,
                    lines: label.lines,
                }));
                dispatch(populateLabels(labels));
            });

    }
}