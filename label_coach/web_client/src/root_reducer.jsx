import {combineReducers} from "redux";
import {images, labels, searchImages, searchLabels} from "./control/controlReducers";

export default combineReducers({
                                   images,
                                   labels,
                                   searchImages,
                                   searchLabels,
                               })