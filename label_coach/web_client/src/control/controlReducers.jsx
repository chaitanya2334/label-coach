
import produce from "immer";

export function images(images=[], action) {
    return images
}

export function searchLabels(search="", action) {
    switch (action.type) {
        case 'ADD_SEARCH_ENTRY':
            if(action.id === "labels") {
                return action.search_text;
            }
        default:
            return search;
    }
}

export function searchImages(search="", action) {
    switch (action.type) {
        case 'ADD_SEARCH_ENTRY':
            if(action.id === "images") {
                return action.search_text;
            }
        default:
            return search;
    }
}

export function labels(labels=[], action) {
    let newLabels = produce(labels, (draftState) => {
        draftState[action.label_id] = labelReducer(draftState[action.label_id], action)
    });
    return newLabels;
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
            if(action.ann_type === "polygon") {
                newLabel.polygons.push(annotationReducer({id: label.polygons.length}, action));
            }else{
                newLabel.lines.push(annotationReducer({id: label.lines.length}, action));
            }
            return newLabel;

        case 'LOCK_ANN':
        case 'UNLOCK_ANN':
        case 'UPDATE_ANN':
            if(action.ann_type === "polygon") {
                newLabel.polygons[action.item_id] = annotationReducer(newLabel.polygons[action.item_id], action);
            }else{
                newLabel.lines[action.item_id] = annotationReducer(newLabel.lines[action.item_id], action);
            }
            return newLabel;

        case 'CANCEL_ANN':
            if(action.ann_type === "polygon"){
                newLabel.polygons.pop();
            }else{
                newLabel.lines.pop();
            }
            return newLabel;

        case 'TOGGLE_BUTTON':
            newLabel[action.button_type] = !newLabel[action.button_type];
            return newLabel;

        case 'TOGGLE_LABEL':
            newLabel.active = !newLabel.active;
            return newLabel;

        default:
            return newLabel;
    }
}