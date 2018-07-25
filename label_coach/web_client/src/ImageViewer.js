import React, { Component } from 'react';
import './ImageViewer.css';
import OpenSeadragon from 'openseadragon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faCircle, faMinus, faCog} from '@fortawesome/free-solid-svg-icons'

// helper function to load image using promises
function loadImage(src){
    return new Promise(function(resolve, reject) {
        let img = document.createElement('img');
        img.addEventListener('load', function(){  resolve(img) });
        img.addEventListener('error', function(err){ reject(404) });
        img.src = src;
    });
}

export default class ImageViewer extends React.Component {

    constructor(props) {
        super(props)
        this.viewer = null;
    }

    render() {
        let self = this;
        let { id } = this.props;
        return (
            <div className="ocd-div" ref={node => {this.el = node;}}>
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
                this.open_slide("/api/v1/image/slide", 0.2505);
                let onClick = this.onClick.bind(this);
                this.viewer.addHandler('canvas-click', onClick);
            });


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

        // Show the results.
        console.log(webPoint.toString(), viewportPoint.toString(), imagePoint.toString());
    }


    componentDidMount(){
        this.initSeaDragon()
    }
     shouldComponentUpdate(nextProps, nextState){
        return false
    }
}

ImageViewer.defaultProps = { id: 'ocd-viewer',  type:'legacy-image-pyramid', image:"http://www.planwallpaper.com/static/images/HD-Wallpapers1_FOSmVKg.jpeg"};


