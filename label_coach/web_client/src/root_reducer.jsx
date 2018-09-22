import {combineReducers} from "redux";
import {
    currentFolder,
    images,
    labelBarVisibility,
    labels,
    saveIndicator,
    searchImages,
    searchLabels, showHeader,
    thumbnailBarVisibility
} from "./control/controlReducers";
import {authentication} from "./login/loginReducer";
import {folders} from "./browser/browserReducers";

export default combineReducers({
                                   showHeader,
                                   labelBarVisibility,
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