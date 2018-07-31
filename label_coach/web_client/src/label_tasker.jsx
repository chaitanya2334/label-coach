import * as React from "react";
import ImageViewer from "./Imager/ImageViewer";
import "./label_tasker.css";
import SideBar from "./control/sidebar/sidebar.c"
import labels from "./dummy_data.json";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./root_reducer";

export default class LabelTasker extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore(rootReducer, labels);
        const unsubscribe = this.store.subscribe(() =>
                                                     console.log(this.store.getState())
        );
    }



    render() {
        return (
            <Provider store={this.store}>
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"col-lg-10 align-self-center"}>
                        <ImageViewer/>
                    </div>
                    <div className={"col-lg-2 remove-right-padding"}>
                        <SideBar/>
                    </div>
                </div>
            </div>
        </Provider>
        );
    }
}
