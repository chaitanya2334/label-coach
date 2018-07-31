import labelReducer from "../label/reducers";

export function labels(labels=[], action) {
    return Object.assign([], labels, {
                [action.label_id]: labelReducer(labels[action.label_id], action)
            });
}