import * as React from "react";
import ImageViewer from "./Imager/ImageViewer";
import SideBar from "./control/sidebar";


export default class LabelTasker extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"col-lg-10"}>
                        <ImageViewer/>
                    </div>
                    <div className={"col-lg-2"}>
                        <SideBar key={'sidebar'} labels={[{text: "labelA", anns: []}, {text: "labelB", anns: []}]}/>
                    </div>
                </div>
            </div>
        );
    }
}
