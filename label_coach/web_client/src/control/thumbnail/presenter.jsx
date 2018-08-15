import * as React from "react";
import "./thumbnail.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faImage} from '@fortawesome/free-solid-svg-icons';


export default class ThumbnailP extends React.Component {
    constructor(props) {
        super(props);

    }

onClick(){

    }

    render() {
        return (
            <div className="media">
                <div className="media-left">
                    <div className="media-object">
                    <div className="placeholder"></div>
                    </div>
                </div>
                <div className="media-body">
                    <h5 className="media-heading">DSC_9336.jpg</h5>
                    <p>no labels</p>
                </div>
            </div>
        );
    }

}





