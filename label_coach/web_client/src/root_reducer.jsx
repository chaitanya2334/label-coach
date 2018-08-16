import {combineReducers} from "redux";
import {images} from "./control/thumbnail/reducers";
import {labels} from "./control/label_container/reducers";
import {searchImages, searchLabels} from "./control/search_bar/reducers";

export default combineReducers({
                                   images,
                                   labels,
                                   searchImages,
                                   searchLabels,
                               })