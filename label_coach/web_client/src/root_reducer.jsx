import {combineReducers} from "redux";
import {currentFolder, images, labels, saveIndicator, searchImages, searchLabels} from "./control/controlReducers";
import {authentication} from "./login/loginReducer";
import {folders} from "./browser/browserReducers";

export default combineReducers({
                                   saveIndicator,
                                   authentication,
                                   folders,
                                   currentFolder,
                                   images,
                                   labels,
                                   searchImages,
                                   searchLabels,
                               })