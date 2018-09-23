import {combineReducers} from "redux";
import {
    currentFolder,
    images,
    labels, rightBar,
    saveIndicator,
    searchImages,
    searchLabels, showHeader,
    thumbnailBarVisibility
} from "./control/controlReducers";
import {authentication} from "./login/loginReducer";
import {folders} from "./browser/browserReducers";

export default combineReducers({
                                   showHeader,
                                   rightBar,
                                   thumbnailBarVisibility,
                                   saveIndicator,
                                   authentication,
                                   folders,
                                   currentFolder,
                                   images,
                                   labels,
                                   searchImages,
                                   searchLabels,
                               })