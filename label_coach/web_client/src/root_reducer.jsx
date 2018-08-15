import {combineReducers} from "redux";
import {labels} from "./control/sidebar/reducers";
import {search} from "./control/search_bar/reducers"

export default combineReducers({
                                   labels,
                                    search,
                               })
