import polygonReducer from "../polygon_item/reducers";

export default function labelReducer(label, action) {
    let newLabel = Object.assign({}, label);
    switch (action.type) {
        case 'ADD_POLY':
            newLabel.polygon_list.push(polygonReducer({id: label.polygon_list.length}, action));
            return newLabel;

        case 'LOCK_POLY':
        case 'UNLOCK_POLY':
        case 'UPDATE_POLY':
            newLabel.polygon_list[action.poly_id] = polygonReducer(newLabel.polygon_list[action.poly_id], action);
            return newLabel;

        case 'CANCEL_POLY':
            newLabel.polygon_list.pop();
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