import React, {Component} from 'react';
import './ImageViewer.css';
import './overlay/polygon.css'
import OpenSeadragon from 'openseadragon'
import './overlay/osdSvgOverlay'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faCircle, faMinus, faCog} from '@fortawesome/free-solid-svg-icons'
import * as d3 from 'd3'
import Polygon from './overlay/polygon'

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

export default class ImageViewer extends React.Component {

    constructor(props) {
        super(props);
        this.viewer = null;
        this.activePolygon = null;
        this.polygons = [];
        this.zoom = 1;
        this.State = Object.freeze({"Edit": 1, "AddingPoly": 2, "Empty": 3});
        this.drawState = this.State.Empty;
    }

    render() {
        let self = this;
        let {id} = this.props;
        return (
            <div className="ocd-div" ref={node => {
                this.el = node;
            }}>
                <div className="navigator-wrapper c-shadow">
                    <div id="navigator"/>
                </div>
                <div className="openseadragon" id={id}/>
                <ul className="ocd-toolbar">
                    <li><a id="zoom-in"><FontAwesomeIcon icon={faPlus}/></a></li>
                    <li><a id="reset"><FontAwesomeIcon icon={faCircle}/></a></li>
                    <li><a id="zoom-out"><FontAwesomeIcon icon={faMinus}/></a></li>
                    <li><a id="full-page"><FontAwesomeIcon icon={faCog}/></a></li>
                </ul>
            </div>
        )
    }

    initSeaDragon() {
        let self = this;
        let {id, image, type} = this.props;
        loadImage(image)
            .then(data => {
                this.viewer = OpenSeadragon({
                                                id: id,
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
            });
    }

    onViewerReady() {
        this.open_slide("/api/v1/image/slide", 0.2505);
        this.overlay = this.viewer.svgOverlay();
        let onClick = this.onClick.bind(this);
        let onZoom = this.onZoom.bind(this);
        this.viewer.addHandler('canvas-double-click', onClick);
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

    onEsc(){
        if(this.activePolygon) {
            this.activePolygon.end();

        }
        if (this.activePolygon.isComplete()) {
            this.polygons.push(this.activePolygon);
            this.activePolygon = null;
            this.drawState = this.State.Empty;
        }
    }

    onMove(event) {
        let webPoint = event.position;
        let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
        let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
        let zoom = this.viewer.viewport.getZoom(true);
        let imageZoom = this.viewer.viewport.viewportToImageZoom(zoom);

        if (this.activePolygon) {
            this.activePolygon.onMove(viewportPoint);
        }
    }

    open_slide(url, mpp) {
        let tile_source;

        // DZI XML fetched from server (deepzoom_server.py)
        tile_source = url;
        this.viewer.open(tile_source);
    }

    onClick(event) {
        // The canvas-click event gives us a position in web coordinates.
        let webPoint = event.position;

        // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
        let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);

        // Convert from viewport coordinates to image coordinates.
        let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);

        switch (this.drawState) {
            case this.State.Empty:
                if (this.getEditPoly(viewportPoint)) {
                    //starting the edit of a polygon
                    this.activePolygon = this.getEditPoly(viewportPoint);
                    this.drawState = this.State.Edit;
                } else {
                    //else its a new polygon
                    this.activePolygon = new Polygon(this.overlay, this.polygons.length, this.zoom);
                    this.activePolygon.addDot(viewportPoint);
                    this.drawState = this.State.AddingPoly;
                }
                break;

            case this.State.AddingPoly:
                this.activePolygon.addDot(viewportPoint);
                break;

            case this.State.Edit:
                if(this.activePolygon.selectedDot) {
                    this.activePolygon.updateDot(viewportPoint);
                }
                this.activePolygon.end();
                this.activePolygon = null;
                this.drawState = this.State.Empty;
                break;

        }

        // Show the results.
        console.log(webPoint.toString(), viewportPoint.toString(), imagePoint.toString());
    }

    getEditPoly(vpPoint) {
        for (let poly of this.polygons) {
            if(poly.isBeingEdited(vpPoint)){
                return poly;
            }
        }
    }

    onZoom(event){
        this.zoom = event.zoom;
        for(let polygon of this.polygons){
            console.log(event.zoom);
            polygon.onZoom(event);
        }
        if(this.activePolygon) {
            this.activePolygon.onZoom(event);
        }
    }


    componentDidMount() {
        this.initSeaDragon()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }
}

ImageViewer.defaultProps = {
    id: 'ocd-viewer',
    type: 'legacy-image-pyramid',
    image: "http://www.planwallpaper.com/static/images/HD-Wallpapers1_FOSmVKg.jpeg"
};


