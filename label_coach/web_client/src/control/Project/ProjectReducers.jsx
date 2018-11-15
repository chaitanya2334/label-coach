import {produce} from "immer";


export function currentProject(currentProject = {tabIdx: 0}, action) {
    return produce(currentProject, draft => {
                       switch (action.type) {
                           case "SET_PROJECT_TAB":
                               draft.tabIdx = action.tabIdx;
                               break;
                           default:
                               return draft;
                       }
                   }
    );
}