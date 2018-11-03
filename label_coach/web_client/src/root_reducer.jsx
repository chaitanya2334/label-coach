import {combineReducers} from "redux";
import {
    currentAssignment,
    images,
    labels, rightBar,
    saveIndicator,
    searchImages,
    searchLabels, showHeader,
    thumbnailBarVisibility, tools, adminData,
} from "./control/controlReducers";
import {authentication} from "./login/loginReducer";
import {assignments} from "./browser/browserReducers";

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
                               })