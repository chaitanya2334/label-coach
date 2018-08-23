import {combineReducers} from "redux";
import {images, labels, searchImages, searchLabels} from "./control/controlReducers";
import {authentication} from "./login/loginReducer";

export default combineReducers({
                                   authentication,
                                   images,
                                   labels,
                                   searchImages,
                                   searchLabels,
                               })