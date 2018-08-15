import * as React from "react";
import ImageViewer from "./Imager/image_viewer/container";
import "./label_tasker.css";
import labels from "./dummy_data.json";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./root_reducer";
import SideBarP from "./control/sidebar/presenter";
import ImageContainer from "./control/image_container/container";
import LabelContainer from "./control/label_container/container";

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
                        <div className={"col-lg-2 remove-left-padding"}>
                            <SideBarP itemType="images">
                                <ImageContainer/>
                            </SideBarP>
                        </div>
                        <div className={"col-lg-8 align-self-center"}>
                            <ImageViewer/>
                        </div>
                        <div className={"col-lg-2 remove-right-padding"}>
                            <SideBarP itemType="labels">
                                <LabelContainer/>
                            </SideBarP>
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }
}
