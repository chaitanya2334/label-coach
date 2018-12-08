import React from 'react';
import '../../styles/ImageViewer.css';
import {getCurrentToken} from "girder/auth";
import 'fabric';
import OpenSeadragon from 'openseadragon'
import './osdCanvasOverlay';
import connect from "react-redux/es/connect/connect";
import Brush from "./brush";
import {
    addAnnotation,
    lockAnnotation,
    setSaveStatus,
    updateAnnotation,
    postBrushCanvas, replaceAnnotation
} from "../../control/controlActions";
import Eraser from "./eraser";


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

class OSDCanvasP extends React.Component {

    constructor(props) {
        super(props);
        this.viewer = null;
        this.zoom = 1;
        this.id = 'ocd-viewer';
    }

    render() {

        return (
            <div className="ocd-div" ref={node => {
                this.el = node;
            }}>
                <div className="navigator-wrapper c-shadow">
                    <div id="navigator"/>
                </div>
                <div className="openseadragon" id={this.id}/>
            </div>
        )
    }

    initSeaDragon() {
        this.viewer = new OpenSeadragon({
                                            id: this.id,
                                            visibilityRatio: 1,
                                            constrainDuringPan: false,
                                            defaultZoomLevel: 0,
                                            zoomPerClick: 1,
                                            minZoomLevel: 0,
                                            maxZoomLevel: 40,
                                            zoomInButton: 'zoom-in',
                                            zoomOutButton: 'zoom-out',
                                            homeButton: 'reset',
                                            fullPageButton: 'full-page',
                                            showNavigator: true,
                                            navigatorId: 'navigator',
                                            //navigatorAutoFade: true,
                                        });
        this.onViewerReady();
    }

    onViewerReady() {
        this.fabOverlay = this.viewer.fabricjsOverlay({scale: 1000});
        this.viewer.addHandler('tile-loaded', ()=>{
             this.props.hideLoading();
        })
    }

    open_slide(url, mpp) {
        let tile_source;

        // DZI XML fetched from server (deepzoom_server.py)
        tile_source = url;
        this.viewer.open(tile_source);
    }

    setActiveTool(activeTool, activeLabel) {
        switch (activeTool) {
            case "brush":
                if (!this.activeTool) {
                    this.activeTool = new Brush(this.fabOverlay,
                                                this.viewer,
                                                activeLabel.ann.brushes.length,
                                                activeLabel,
                                                this.props.toolRadius,
                                                this.props.labelFolderId,
                                                this.props.updateStrokes);
                    this.activeTool.activate();
                }
                break;
            case "eraser":
                if (!this.activeTool) {
                    this.activeTool = new Eraser(this.fabOverlay,
                                                 this.viewer,
                                                 activeLabel.ann.brushes.length,
                                                 activeLabel,
                                                 this.props.toolRadius,
                                                 this.props.labelFolderId,
                                                 this.props.updateStrokes);
                    this.activeTool.activate();
                }
                break;
            default:
                if (this.activeTool) {
                    this.activeTool.deactivate();
                }
                this.activeTool = null;
        }
    }

    redraw() {
        let json = {objects: [], version: '2.4.4'};
        for (let brush of this.props.brushes) {
            let newObj = Object.assign({}, brush.jsonObj);
            //newObj.globalCompositeOperation = "xor";
            json.objects.push(newObj);
            this.fabOverlay.fabricCanvas().viewportTransform = brush.transform;
        }
        if (json.objects.length > 0) {
            this.fabOverlay.fabricCanvas()
                .loadFromJSON(json, () => {
                    this.fabOverlay.fabricCanvas()
                        .renderAll();
                });
        }

    }

    updateOverlay() {

        let {activeLabel, activeTool} = this.props;

        // save all of the annotations made by the previous active tool
        if (this.activeTool) {
            this.activeTool.deactivate();
            this.activeTool = null;
        }
        // clear the canvas
        this.fabOverlay.clear();

        this.redraw();

        // allow for new annotation to be added through activeTool
        if (activeLabel) {
            this.setActiveTool(activeTool, activeLabel);
        }
    }

    componentDidMount() {
        this.initSeaDragon();

    }

    getSnapshotBeforeUpdate(prevProps) {
        if (prevProps.dbId !== this.props.dbId) {
            if (this.props.mimeType === "application/octet-stream") {
                let dziPath = "api/v1/image/dzi/" + this.props.dbId;
                this.open_slide(dziPath, 0.2505);
            } else {
                let imagePath = "api/v1/image/" + this.props.dbId;
                this.viewer.open({
                                     type: 'image',
                                     url: imagePath,
                                     buildPyramid: false
                                 });
            }
            this.updateOverlay = this.updateOverlay.bind(this);
            this.viewer.addOnceHandler('open', this.updateOverlay);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateOverlay();
    }

}

// ---------- Container ----------

function getActiveLabel(labels) {
    for (let label of labels) {
        if (label.active) {
            return label;
        }
    }
    return null;
}

function getToolRadius(tools, activeTool) {
    if (activeTool !== "" && tools[activeTool]) {
        return tools[activeTool].size || 10;
    }
}

function mapLabelsToAnns(labels) {
    let brushes = [];
    for (let label of labels) {
        let newBrushes = label.ann.brushes.map((brush) => {
            let newBrush = Object.assign({}, brush);
            newBrush.label = label;
            newBrush.id = brush.id;
            return newBrush;
        });
        brushes = brushes.concat(newBrushes);
    }
    return [brushes];
}

function showAll(arr) {
    arr.forEach((item, i) => {
        item.displayed = true
    });
    return arr;
}

function getLabelFolderId(currentAssignment) {
    if (currentAssignment.hasOwnProperty('label_folders') && currentAssignment.label_folders.length > 0) {
        return currentAssignment.label_folders[0]._id.$oid;
    }
}

function mapStateToProps(state) {
    let [brushes] = mapLabelsToAnns(state.labels);
    brushes = showAll(brushes);
    return {
        activeLabel: getActiveLabel(state.labels),
        toolRadius: getToolRadius(state.tools, state.rightBar),
        activeTool: state.rightBar,
        brushes: brushes,
        labelFolderId: getLabelFolderId(state.currentAssignment)
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        updateStrokes: (folder_id, ann_type, label_id, brush_id, jsonObjs, transform) => {
            //dispatch(postBrushCanvas(folder_id, ann_type, label_id, brush_id, jsonObjs, transform));
            let i = 0;
            for (let jsonObj of jsonObjs.objects) {
                dispatch(replaceAnnotation(ann_type, label_id, i, {jsonObj: jsonObj, transform: transform}));
                i++;
            }
            dispatch(setSaveStatus("dirty"));
        }
    }
}

const OSDCanvas = connect(
    mapStateToProps,
    mapDispatchToProps,
)(OSDCanvasP);

export default OSDCanvas;


