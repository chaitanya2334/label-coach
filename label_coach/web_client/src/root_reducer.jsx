import {combineReducers} from "redux";
import {
    currentAssignment, hasMoreImages, imageReady,
    images,
    labels, navState, rightBar,
    saveIndicator,
    searchImages,
    searchLabels, showHeader,
    thumbnailBarVisibility, tools, viewer,
} from "./control/controlReducers";
import {authentication} from "./login/loginReducer";
import {assignments, hasMoreAssignments} from "./browser/browserReducers";
import {adminData} from "./control/Admin/AdminReducers";
import {loadingBarReducer} from 'react-redux-loading-bar';

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
                                   hasMoreAssignments,
                                   hasMoreImages,
                                   imageReady,
                                   loadingBar: loadingBarReducer,
                                   viewer: viewer
                               })