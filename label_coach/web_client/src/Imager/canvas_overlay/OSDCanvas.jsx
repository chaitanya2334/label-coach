import React from 'react';
import '../../styles/ImageViewer.css';
import {getCurrentToken} from "girder/auth";
import 'fabric';
import OpenSeadragon from 'openseadragon'
import './osdCanvasOverlay';
import connect from "react-redux/es/connect/connect";
import Brush from "./brush";
import {
    postLabelImage,
    replaceAnnotation, setDirtyStatus
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
        this.handleUpdateStrokes = this.handleUpdateStrokes.bind(this);
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
        this.viewer.addHandler('tile-loaded', () => {
            this.props.hideLoading();
            this.props.imageIsReady();
        })
    }

    open_slide(url, mpp) {
        let tile_source;

        // DZI XML fetched from server (deepzoom_server.py)
        tile_source = url;
        this.viewer.open(tile_source);
    }

    handleUpdateStrokes(folderId, ann_type, labelId, brushId, jsonObj, transform) {
        let {labels} = this.props;
        labels = Object.assign({}, labels);
        let brushes = labels.find(x => x.id === labelId).ann.brushes;

        for (let jsonObj of jsonObjs.objects) {
            let brush = brushes.find(x => x.id === brushId);

            if (brush !== undefined) {
                brush.jsonObj = jsonObj;
                brush.transform = transform;

            } else {
                let newbrush = Object.assign({}, {id: brushes.length});
                newbrush.text = "brush" + newbrush.id;
                newbrush.path = [];
                newbrush.drawState = "create";
                newbrush.jsonObj = jsonObj;
                newbrush.transform = transform;

                labels.find(x => x.id === labelId)
                      .ann
                      .brushes
                      .push(newbrush);

            }
        }
        this.props.updateStrokes(labels);
    }

    setActiveTool(activeTool, activeLabel) {
        switch (activeTool) {
            case "brush":
                this.activeTool = new Brush(this.fabOverlay,
                                            this.viewer,
                                            activeLabel.ann.brushes.length,
                                            activeLabel,
                                            this.props.toolRadius,
                                            this.props.labelFolderId,
                                            this.props.updateStrokes,
                                            this.props.updateLabelImage);
                this.activeTool.activate();
                break;

            case "eraser":
                this.activeTool = new Eraser(this.fabOverlay,
                                             this.viewer,
                                             activeLabel.ann.brushes.length,
                                             activeLabel,
                                             this.props.toolRadius,
                                             this.props.labelFolderId,
                                             this.props.updateStrokes,
                                             this.props.updateLabelImage);
                this.activeTool.activate();
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
            //this.fabOverlay.fabricCanvas().viewportTransform = brush.transform;
        }

        json.objects.sort((a, b) => (a.id > b.id) ? 1 : ((a.id < b.id) ? -1 : 0));

        // clear the canvas
        let viewport = this.fabOverlay.fabricCanvas().viewportTransform;
        //this.fabOverlay.fabricCanvas().viewportTransform = [1, 0, 0, 1, 0, 0];
        this.fabOverlay.fabricCanvas()
            .loadFromJSON(json, () => {
                this.fabOverlay.fabricCanvas()
                    .renderAll();
            });
        this.fabOverlay.fabricCanvas().viewportTransform = viewport;


    }

    updateOverlay() {

        let {activeLabel, activeTool} = this.props;

        // save all of the annotations made by the previous active tool
        if (this.activeTool) {
            this.activeTool.deactivate();
            this.activeTool = null;
        }
        this.fabOverlay.clear();
        this.fabOverlay.fabricCanvas()
            .renderAll();

        if (this.props.imageReady) {
            this.redraw();
        }

        // allow for new annotation to be added through activeTool
        if (activeTool && activeLabel) {
            this.setActiveTool(activeTool, activeLabel);
            this.prevTool = activeTool;
            this.prevLabelId = activeLabel.id;
        }

    }

    componentDidMount() {
        this.initSeaDragon();
        this.prevTool = "";
        this.prevLabelId = -1;
    }

    static isEmptyOrSame(prevLabel, currLabel) {
        if (!prevLabel && currLabel) {
            return false;
        }

        return currLabel && prevLabel && currLabel.id === prevLabel.id;

    }

    static isAnnChanged(prevLabel, currLabel){
        return !OSDCanvasP.isEmptyOrSame(prevLabel, currLabel) ||
            prevLabel.ann.brushes.length !== currLabel.ann.brushes.length ||
            prevLabel.ann.polygons.length !== currLabel.ann.polygons.length;
    }

    getSnapshotBeforeUpdate(prevProps) {
        if (prevProps.dbId !== this.props.dbId) {
            if (this.props.mimeType === "application/octet-stream") {
                this.genMask = false;
                let dziPath = "api/v1/image/dzi/" + this.props.dbId;
                this.open_slide(dziPath, 0.2505);
            } else {
                let imagePath = "api/v1/image/" + this.props.dbId;
                this.genMask = true;
                this.viewer.open({
                                     type: 'image',
                                     url: imagePath,
                                     buildPyramid: false
                                 });
            }
            this.updateOverlay = this.updateOverlay.bind(this);
            this.viewer.addOnceHandler('open', this.updateOverlay);
        }

        if ((prevProps.activeTool !== this.props.activeTool) ||
            prevProps.toolRadius !== this.props.toolRadius ||
            OSDCanvasP.isAnnChanged(prevProps.activeLabel, this.props.activeLabel)
        ) {
            this.updateOverlay();
            this.updateOverlay();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //this.updateOverlay();
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
        labelFolderId: getLabelFolderId(state.currentAssignment),
        labels: state.labels,
        imageReady: state.imageReady
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        updateStrokes: (folder_id, ann_type, label_id, brush_id, jsonObj, transform) => {
            //dispatch(postBrushCanvas(folder_id, ann_type, label_id, brush_id, jsonObjs, transform));

            dispatch(replaceAnnotation(ann_type, label_id, brush_id, {jsonObj: jsonObj, transform: transform}));
            dispatch(setDirtyStatus());
        },
        updateLabelImage: (labelName, folderId, labelImg) => {
            if (ownProps.title !== undefined) {
                dispatch(postLabelImage(labelName, ownProps.title, folderId, labelImg));
            }
        }
    }
}

const OSDCanvas = connect(
    mapStateToProps,
    mapDispatchToProps,
)(OSDCanvasP);

export default OSDCanvas;


