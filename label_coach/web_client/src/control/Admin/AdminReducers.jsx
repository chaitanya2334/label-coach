import produce from "immer";
import {labelReducer, labels} from "../controlReducers";

export function annotatorReducer(annotator = {}, action) {
    return produce(annotator, draft => {
                       let subAction;
                       switch (action.type) {
                           case "SET_ADMIN_LABELS":
                               draft['labels'] = action.labels;
                               return draft;

                           case "EXPAND_ADMIN_LABEL":
                               subAction = Object.assign({}, action);
                               subAction.type = "EXPAND_LABEL";
                               draft['labels'] = labels(draft['labels'], subAction);
                               return draft;

                           case "SHOW_ADMIN_ANN":
                               subAction = Object.assign({}, action);
                               subAction.type = "SHOW_ANN";
                               draft['labels'] = labels(draft['labels'], subAction);
                               return draft;

                           case "HIDE_ADMIN_ANN":
                               subAction = Object.assign({}, action);
                               subAction.type = "HIDE_ANN";
                               draft['labels'] = labels(draft['labels'], subAction);
                               return draft;

                           case "ADMIN_SHOW_ALL_ANN":
                               subAction = Object.assign({}, action);
                               subAction.type = "SHOW_ALL_ANN";
                               draft['labels'] = labels(draft['labels'], subAction);
                               return draft;

                           case "ADMIN_HIDE_ALL_ANN":
                               subAction = Object.assign({}, action);
                               subAction.type = "HIDE_ALL_ANN";
                               draft['labels'] = labels(draft['labels'], subAction);
                               return draft;

                           case "EXPAND_ADMIN_ANNOTATOR":
                               draft.expanded = action.state;
                               return draft;

                           default:
                               return draft;
                       }
                   }
    );

}

export function annotatorsReducer(annotators, action) {
    return produce(annotators, draft => {
                       let idx = draft.findIndex(obj => obj.user._id.$oid === action.user_id.$oid);
                       if (idx !== -1) {
                           switch (action.type) {
                               case "SET_ADMIN_LABELS":
                               case "EXPAND_ADMIN_LABEL":
                               case "SHOW_ADMIN_ANN":
                               case "HIDE_ADMIN_ANN":
                               case "ADMIN_SHOW_ALL_ANN":
                               case "ADMIN_HIDE_ALL_ANN":
                                   draft[idx] = annotatorReducer(draft[idx], action);
                                   return draft;
                               case "EXPAND_ADMIN_ANNOTATOR":
                                   for (let annotator in draft) {
                                       draft[annotator].expanded = false;
                                   }
                                   draft[idx] = annotatorReducer(draft[idx], action);
                                   return draft;

                               default:
                                   return draft;
                           }
                       }
                   }
    );
}

export function adminData(adminData = {}, action) {
    return produce(adminData, draft => {
                       switch (action.type) {
                           case "SET_ADMIN_DATA":
                               return action.adminData;

                           case "SET_SOME_SETTING":
                               draft['somesetting'] = true;
                               return draft;

                           case "EXPAND_ADMIN_LABEL":
                           case "SET_ADMIN_LABELS":
                           case "EXPAND_ADMIN_ANNOTATOR":
                           case "SHOW_ADMIN_ANN":
                           case "HIDE_ADMIN_ANN":
                           case "ADMIN_SHOW_ALL_ANN":
                           case "ADMIN_HIDE_ALL_ANN":
                               draft['annotators'] = annotatorsReducer(draft['annotators'], action);
                               return draft;
                           default:
                               return draft;
                       }
                   }
    );
}