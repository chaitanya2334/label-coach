import polygonReducer from "../polygon_item/reducers";

export default function labelReducer(label, action) {
    let newLabel = Object.assign({}, label);
    switch (action.type) {
        case 'ADD_POLY':
            newLabel.polygon_list.push({
                                           id: label.polygon_list.length,
                                           text: "polygon" + label.polygon_list.length,
                                           points: [],
                active: true
                                       });
            return newLabel;
        case 'UPDATE_POLY':
            newLabel.polygon_list[action.poly_id] = polygonReducer(newLabel.polygon_list[action.poly_id], action);
            return newLabel;

        case 'CANCEL_POLY':
            newLabel.polygon_list.pop();
            return newLabel;

        case 'TOGGLE_TEXT':
            if(newLabel.button === "Create") {
                newLabel.button = "Cancel";
            }else{
                newLabel.button = "Create";
            }
            return newLabel;

        case 'TOGGLE_LABEL':
            newLabel.active = !newLabel.active;
            return newLabel;

        default:
            return newLabel;
    }
}