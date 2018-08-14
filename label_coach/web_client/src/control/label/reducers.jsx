
import annotationReducer from "../annotation/reducers";

export default function labelReducer(label, action) {
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