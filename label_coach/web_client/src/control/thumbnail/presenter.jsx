import * as React from "react";
import "./thumbnail.css";


export default class ThumbnailP extends React.Component {
    constructor(props) {
        super(props);

    }

onClick(){

    }

    render() {
        return (
            <div class="media">
                <div class="media-left">
                    <img class="media-object" src="label_coach/web_client/static/images/dsc_9336.jpg" />
                </div>
                <div class="media-body">
                    <h4 class="media-heading">DSC_9336.jpg</h4>
                </div>
            </div>
        );
    }

}





