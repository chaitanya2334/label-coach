import {combineReducers} from "redux";
import {images, labels, saveIndicator, searchImages, searchLabels} from "./control/controlReducers";
import {authentication} from "./login/loginReducer";
import {folders} from "./browser/browserReducers";

export default combineReducers({
                                   saveIndicator,
                                   authentication,
                                   folders,
                                   images,
                                   labels,
                                   searchImages,
                                   searchLabels,
                               })