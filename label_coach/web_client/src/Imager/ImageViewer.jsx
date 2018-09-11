import React from 'react';
import '../styles/ImageViewer.css';
import {getCurrentToken} from "girder/auth";
import OpenSeadragon from 'openseadragon'
import './overlay/osdSvgOverlay'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faExpand,
    faHome,
    faSearchMinus,
    faSearchPlus
} from '@fortawesome/free-solid-svg-icons'
import connect from "react-redux/es/connect/connect";
import {lockAnnotation, setSaveStatus, updateAnnotation} from "../control/controlActions";
import Polygon from "./overlay/polygon";
import Line from "./overlay/line";
import SaveIndicator from "../control/SaveIndicator";

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
        this.activePolygon = null;
        this.polygons = [];
        this.lines = [];
        this.zoom = 1;
        this.State = Object.freeze({"Edit": 1, "AddingPoly": 2, "Empty": 3});
        this.drawState = this.State.Empty;
        this.id = 'ocd-viewer';
        this.inDrag = false;
        this.setPan(true);
    }

    render() {

        return (
            <div>
                <div className={"title"}>{this.props.title}</div>
                <SaveIndicator/>
                <div className="ocd-div" ref={node => {
                    this.el = node;
                }}>
                    <div className="navigator-wrapper c-shadow">
                        <div id="navigator"/>
                    </div>
                    <div className="openseadragon" id={this.id}/>
                    <ul className="ocd-toolbar">
                        <li>
                            <a id="zoom-in"><FontAwesomeIcon icon={faSearchPlus}/></a>
                            <div className="vert-divider"/>
                        </li>

                        <li>
                            <a id="reset"><FontAwesomeIcon icon={faHome}/></a>
                            <div className="vert-divider"/>
                        </li>

                        <li>
                            <a id="zoom-out"><FontAwesomeIcon icon={faSearchMinus}/></a>
                            <div className="vert-divider"/>
                        </li>

                        <li>
                            <a id="full-page"><FontAwesomeIcon icon={faExpand}/></a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    initSeaDragon() {
        this.viewer = new OpenSeadragon({
                                            id: this.id,
                                            visibilityRatio: 1.0,
                                            constrainDuringPan: false,
                                            defaultZoomLevel: 1,
                                            zoomPerClick: 1,
                                            minZoomLevel: 1,
                                            maxZoomLevel: 10,
                                            zoomInButton: 'zoom-in',
                                            zoomOutButton: 'zoom-out',
                                            homeButton: 'reset',
                                            fullPageButton: 'full-page',
                                            nextButton: 'next',
                                            previousButton: 'previous',
                                            showNavigator: true,
                                            navigatorId: 'navigator',
                                        });
        this.onViewerReady();
    }

    onViewerReady() {

        this.overlay = this.viewer.svgOverlay();
        let onClick = this.onClick.bind(this);
        let onZoom = this.onZoom.bind(this);
        this.viewer.addHandler('canvas-click', onClick);
        this.viewer.addHandler('canvas-drag', (event) => {

            event.preventDefaultAction = (this.activePolygon || this.activeLine);
            this.onDrag(event);
        });
        this.viewer.addHandler('zoom', onZoom);
        this.moveTracker = new OpenSeadragon.MouseTracker({
                                                              element: this.viewer.container,
                                                              moveHandler: (event) => {
                                                                  this.onMove(event);
                                                              }
                                                          });
        this.moveTracker.setTracking(true);
        let onEsc = this.onEsc.bind(this);
        document.addEventListener("keydown", onEsc, false);

    }

    onEsc() {
        if (this.activePolygon) {
            this.activePolygon.end();
            this.props.lockPolygon(this.activePolygon.label_id, this.activePolygon.poly_id);
            this.activePolygon = null;
        }
    }

    onMove(event) {
        // we dont want to process move if the viewer is currently being dragged.
        let webPoint = event.position;
        let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
        let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
        let zoom = this.viewer.viewport.getZoom(true);
        let imageZoom = this.viewer.viewport.viewportToImageZoom(zoom);

        if (this.activePolygon) {
            switch (this.activePolygon.drawState) {
                case "edit":
                    if (this.activePolygon.selectedDot) {
                        this.activePolygon.movePotentialPoint(viewportPoint);
                    } else {
                        this.activePolygon.dotOnPerimeter(viewportPoint);
                    }
                    break;
                case "create":
                    this.activePolygon.movePotentialPoint(viewportPoint);
                    break;
            }
        }

    }

    open_slide(url, mpp) {
        let tile_source;

        // DZI XML fetched from server (deepzoom_server.py)
        tile_source = url;
        this.viewer.open(tile_source);
    }

    setPan(value) {
        this.pan = value;
    }

    onDrag(event) {
        // The canvas-click event gives us a position in web coordinates.
        let webPoint = event.position;

        // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
        let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);

        // Convert from viewport coordinates to image coordinates.
        let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);

        if (this.activeLine && this.activeLine.drawState) {
            switch (this.activeLine.drawState) {
                case "create":
                    this.activeLine.appendDot(viewportPoint);
                    this.props.updateLine(this.activeLine.labelId, this.activeLine.lineId,
                                          this.activeLine.getImagePoints());
                    break;
            }
        }

    }

    onClick(event) {
        //we dont want to process a click if the viewer is currently being dragged.
        console.log("quick: " + event.quick);
        if (event.quick) {
            // The canvas-click event gives us a position in web coordinates.
            let webPoint = event.position;

            // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
            let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);

            // Convert from viewport coordinates to image coordinates.
            let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);

            if (this.activePolygon && this.activePolygon.drawState) {
                switch (this.activePolygon.drawState) {
                    case "create":
                        this.activePolygon.appendDot(viewportPoint);
                        this.props.updatePolygon(this.activePolygon.label_id, this.activePolygon.poly_id,
                                                 this.activePolygon.getImgPoints());
                        break;

                    case "edit":
                        if (this.activePolygon.selectedDot) {
                            this.activePolygon.updateDot(viewportPoint);
                            this.activePolygon.save();
                            this.props.updatePolygon(this.activePolygon.label_id, this.activePolygon.poly_id,
                                                     this.activePolygon.getImgPoints());
                        } else {
                            this.activePolygon.selectedDot =
                                this.activePolygon.insertDot(this.activePolygon.potentialDot,
                                                             this.activePolygon.potentialDotLeftId);
                        }
                        break;
                }
            }
            // Show the results.
            console.log(webPoint.toString(), viewportPoint.toString(), imagePoint.toString());
        }
    }

    onZoom(event) {
        this.zoom = event.zoom;
        for (let polygon of this.polygons) {
            console.log(event.zoom);
            polygon.onZoom(event);
        }
        if (this.activePolygon) {
            this.activePolygon.onZoom(event);
        }
    }

    updateOverlay() {
        // delete all polygons
        for (let polygon of this.polygons) {
            polygon.delete();
        }

        for (let line of this.lines) {
            line.delete();
        }
        this.lines = [];
        this.polygons = [];
        this.activePolygon = null;

        //create polygons from props
        for (let polygon of this.props.polygons) {
            let polyObj = new Polygon(this.overlay, this.viewer, polygon.label_id, polygon.poly_id, this.zoom);
            polyObj.addImagePoints(polygon.points);
            this.polygons.push(polyObj);
            if (polygon.drawState !== "read-only") {
                this.activePolygon = polyObj;
                this.activePolygon.setDrawState(polygon.drawState);
            } else {
                polyObj.save();
            }
        }
        this.activeLine = null;
        for (let line of this.props.lines) {
            let lineObj = new Line(this.overlay, this.viewer, line.label_id, line.line_id, this.zoom);
            lineObj.addImagePoints(line.points);
            this.lines.push(lineObj);
            if (line.drawState !== "read-only") {
                this.activeLine = lineObj;
                this.activeLine.setDrawState(line.drawState);
            } else {
                lineObj.save();
            }
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

function mapStateToProps(state) {
    let polygons = [];
    let lines = [];
    let dbId = "";
    let mimeType = "";
    let title = "Untitled";
    for (let image of state.images) {
        if (image.active) {
            title = image.title;
            mimeType = image.mimeType;
            dbId = image.dbId;
            break;
        }
    }

    for (let label of state.labels) {
        let newPolygons = label.polygons.map((poly) => {
            let newPoly = Object.assign({}, poly);
            newPoly.label_id = label.id;
            newPoly.poly_id = poly.id;
            return newPoly;
        });
        let newLines = label.lines.map((line) => {
            let newLine = Object.assign({}, line);
            newLine.label_id = label.id;
            newLine.line_id = line.id;
            return newLine;
        });
        lines = lines.concat(newLines);
        polygons = polygons.concat(newPolygons);
    }
    return {
        title: title,
        mimeType: mimeType,
        dbId: dbId,
        polygons: polygons,
        lines: lines
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePolygon: (label_id, poly_id, points) => {
            dispatch(updateAnnotation("polygon", label_id, poly_id, points));
        },
        lockPolygon: (label_id, poly_id) => {
            dispatch(lockAnnotation("polygon", label_id, poly_id));
            dispatch(setSaveStatus("dirty"));
        },
        updateLine: (label_id, line_id, points) => {
            dispatch(updateAnnotation("line", label_id, line_id, points));
        },
        lockLine: (label_id, line_id) => {
            dispatch(lockAnnotation("line", label_id, line_id));
            dispatch(setSaveStatus("dirty"));
        }
    };
}

const ImageViewer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ImageViewerP);

export default ImageViewer;


