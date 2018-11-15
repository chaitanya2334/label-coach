import {combineReducers} from "redux";
import {
    currentAssignment,
    images,
    labels, navState, rightBar,
    saveIndicator,
    searchImages,
    searchLabels, showHeader,
    thumbnailBarVisibility, tools,
} from "./control/controlReducers";
import {authentication} from "./login/loginReducer";
import {assignments} from "./browser/browserReducers";
import {adminData} from "./control/Admin/AdminReducers";
import {currentProject} from "./control/Project/ProjectReducers";

export default combineReducers({
                                   tools,
                                   showHeader,
                                   rightBar,
                                   thumbnailBarVisibility,
                                   saveIndicator,
                                   authentication,
                                   adminData,
                                   assignments,
                                   currentAssignment,
                                   images,
                                   labels,
                                   searchImages,
                                   searchLabels,
                                   navState,
                                   currentProject,
                               })