import produce from "immer";

export function saveIndicator(saveIndicator={}, action){
    switch (action.type) {
        case 'EDIT_SAVE_INDICATOR_TEXT':
            return produce(saveIndicator, draftState => {
                draftState.text = action.text
            });
        case 'SET_SAVE_STATUS':
            return produce(saveIndicator, draftState => {
                draftState.status = action.status
            });
        case 'SET_LAST_UPDATED':
            return produce(saveIndicator, draftState => {
                draftState.lastUpdated = action.date;
            });
        default:
            return saveIndicator;
    }
}

export function imageReducer(image, action) {
    switch (action.type) {
        case 'SELECT_IMAGE':
            return produce(image, draftState => {
                draftState.active = true;
            });
        case 'DESELECT_IMAGE':
            return produce(image, draftState => {
                draftState.active = false;
            });
        case 'ADD_LABEL_ID':
            return produce(image, draftState => {
                draftState.labelFileId = action.label_id
            });
        default:
            return image;
    }
}

export function currentFolder(currentFolder={}, action) {
    switch (action.type) {
        case 'SET_CURRENT_FOLDER':
            return produce(currentFolder, draftState=>{
                draftState.id = action.id;
            });
        default:
            return currentFolder;
    }
}

export function images(images = [], action) {
    switch (action.type) {
        case 'POPULATE_IMAGES':

            return produce(images, draftState => {
                draftState = [];
                for (let image of action.images) {
                    draftState.push({
                                        id: draftState.length,
                                        active: false,
                                        title: image.title,
                                        dbId: image.dbId,
                                        mimeType: image.mimeType,
                                        labelFileId: image.labelFileId
                                    })
                }
                return draftState;
            });
        case 'SELECT_IMAGE':
            return produce(images, (draftState) => {
                // deselect everybody
                for (let image of draftState) {
                    image.active = false;
                }

                draftState[action.image_id] = imageReducer(draftState[action.image_id], action)
            });
        case 'ADD_LABEL_ID':
            return produce(images, (draftState) => {
                draftState[action.image_id] = imageReducer(draftState[action.image_id], action)
            });
        default:
            return images;
    }
    return images;
}

export function searchLabels(search = "", action) {
    switch (action.type) {
        case 'ADD_SEARCH_ENTRY':
            if (action.id === "labels") {
                return action.search_text;
            }
        default:
            return search;
    }
}

export function searchImages(search = "", action) {
    switch (action.type) {
        case 'ADD_SEARCH_ENTRY':
            if (action.id === "images") {
                return action.search_text;
            }
        default:
            return search;
    }
}

export function labels(labels = [], action) {
    switch (action.type) {
        case 'REPLACE_LABELS':
            return produce(labels, draftState => {
                draftState = [];
                for (let label of action.labels) {
                    draftState.push({
                                        id: draftState.length,
                                        active: false,
                                        name: label.name,
                                        poly_button: true,
                                        line_button: true,
                                        color: label.color,
                                        polygons: label.polygons.map((polygon, index) => ({
                                            id: index,
                                            drawState: "read-only",
                                            text: polygon.text,
                                            points: polygon.points
                                        })),
                                        lines: label.lines.map((line, index) => ({
                                            id: index,
                                            drawState: "read-only",
                                            text: line.text,
                                            points: line.points
                                        })),
                                    });
                }
                return draftState;
            });
        case 'ADD_ANN':
        case 'LOCK_ANN':
        case 'UNLOCK_ANN':
        case 'UPDATE_ANN':
        case 'CANCEL_ANN':
        case 'TOGGLE_BUTTON':
        case 'TOGGLE_LABEL':
            return produce(labels, (draftState) => {
                draftState[action.label_id] = labelReducer(draftState[action.label_id], action)
            });

        default:
            return labels;

    }

}

export function annotationReducer(ann, action) {
    let newAnn = Object.assign({}, ann);
    switch (action.type) {
        case 'ADD_ANN':
            newAnn.text = action.ann_type + newAnn.id;
            newAnn.points = [];
            newAnn.drawState = "create";
            return newAnn;

        case 'LOCK_ANN':
            newAnn.drawState = "read-only";
            return newAnn;

        case 'UNLOCK_ANN':
            newAnn.drawState = "edit";
            return newAnn;

        case 'UPDATE_ANN':
            if (newAnn.drawState === "edit" || newAnn.drawState === "create") {
                newAnn.points = action.points;
            }
            return newAnn;
    }

}

export function labelReducer(label, action) {
    let newLabel = Object.assign({}, label);
    switch (action.type) {
        case 'ADD_ANN':
            if (action.ann_type === "polygon") {
                newLabel.polygons.push(annotationReducer({id: label.polygons.length}, action));
            } else {
                newLabel.lines.push(annotationReducer({id: label.lines.length}, action));
            }
            return newLabel;

        case 'LOCK_ANN':
        case 'UNLOCK_ANN':
        case 'UPDATE_ANN':
            if (action.ann_type === "polygon") {
                newLabel.polygons[action.item_id] = annotationReducer(newLabel.polygons[action.item_id], action);
            } else {
                newLabel.lines[action.item_id] = annotationReducer(newLabel.lines[action.item_id], action);
            }
            return newLabel;

        case 'CANCEL_ANN':
            if (action.ann_type === "polygon") {
                newLabel.polygons.pop();
            } else {
                newLabel.lines.pop();
            }
            return newLabel;

        case 'TOGGLE_BUTTON':
            newLabel[action.button_type] = !newLabel[action.button_type];
            return newLabel;

        case 'TOGGLE_LABEL':
            newLabel.active = !newLabel.active;
            return newLabel;

        case 'TOGGLE_COLLAPSE':
            newLabel.collapse = !newLabel.collapse;
            return;

        case 'TOGGLE_Expand':
            newLabel.areaexpand = !newLabel.areaexpand;
            return;

        default:
            return newLabel;
    }
}