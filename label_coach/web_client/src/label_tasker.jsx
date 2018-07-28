import * as React from "react";
import ImageViewer from "./Imager/ImageViewer";
import SideBar from "./control/sidebar";
import "./label_tasker.css";
import labels from "./dummy_data.json";

export default class LabelTasker extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"col-lg-10 align-self-center"}>
                        <ImageViewer/>
                    </div>
                    <div className={"col-lg-2 remove-right-padding"}>
                        <SideBar labels={labels}/>
                    </div>
                </div>
            </div>
        );
    }
}
