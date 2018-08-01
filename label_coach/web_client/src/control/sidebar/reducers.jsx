import labelReducer from "../label/reducers";
import produce from "immer";

export function labels(labels=[], action) {
    let newLabels = produce(labels, (draftState) => {
        draftState[action.label_id] = labelReducer(draftState[action.label_id], action)
    });
    return newLabels;
}