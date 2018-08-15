import labelReducer from "../label/reducers";
import produce from "immer";

export function images(images=[], action) {
    return produce(images, (draftState) => {
        draftState[action.image_id] = labelReducer(draftState[action.image_id], action)
    });
}