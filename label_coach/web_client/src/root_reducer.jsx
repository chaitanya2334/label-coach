import {combineReducers} from "redux";
import {images, labels, searchImages, searchLabels} from "./control/controlReducers";
import {authentication} from "./login/loginReducer";
import {folders} from "./browser/browserReducers";

export default combineReducers({
                                   authentication,
                                   folders,
                                   images,
                                   labels,
                                   searchImages,
                                   searchLabels,
                               })