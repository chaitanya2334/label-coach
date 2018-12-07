import React from 'react';
import '../styles/ImageViewer.css';
import {getCurrentToken} from "girder/auth";
import connect from "react-redux/es/connect/connect";
import OSDCanvas from "./canvas_overlay/OSDCanvas";
import ToolBar from "../control/ToolBar";
import SaveIndicator from "../control/SaveIndicator";
import Divider from "@material-ui/core/Divider";

// helper function to load image using promises
function loadImage(src) {
    return new Promise(function (resolve, reject) {
        let img = document.createElement('img');
        img.addEventListener('load', function () {
            resolve(img)
        });
        img.addEventListener('error', function (err) {
            reject(404)
        });
        img.src = src;
    });
}

class ImageViewerP extends React.Component {

    constructor(props) {
        super(props);
        this.viewer = null;
        this.zoom = 1;
    }


    render() {

        return (
            <div className={"image-viewer"}>
                <div className={"iv-header"} style={{display: this.props.showHeader ? "flex" : "none"}}>
                    <div className={"title"}>{this.props.title}</div>
                    <SaveIndicator/>
                </div>
                <Divider/>
                <ToolBar/>
                <Divider/>
                <div className={"gap1em"}/>
                <OSDCanvas dbId={this.props.dbId} mimeType={this.props.mimeType}/>
            </div>
        )
    }

}

// ---------- Container ----------

function getActiveImageInfo(images) {
    let dbId = "";
    let mimeType = "";
    let title = "Untitled";

    for (let image of images) {
        if (image.active) {
            title = image.title;
            mimeType = image.mimeType;
            dbId = image.dbId;
            break;
        }
    }
    return {dbId, mimeType, title}
}

function mapStateToProps(state) {

    let {dbId, mimeType, title} = getActiveImageInfo(state.images);
    return {
        showHeader: state.showHeader,
        title: title,
        mimeType: mimeType,
        dbId: dbId,
        navState: state.navState
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

const SvgImageViewer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ImageViewerP);

export default SvgImageViewer;


