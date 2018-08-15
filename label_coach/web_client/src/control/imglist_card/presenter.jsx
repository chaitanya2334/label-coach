import * as React from "react";
import Thumbnail from "../thumbnail/container";


export default class ImgListCardP extends React.Component {
    constructor(props) {
        super(props);

    }

onClick(){

    }

    render() {
        return (
            <div className="card">
    <div className="card-header">
        <a data-toggle="collapse" href="#imglist-block" aria-expanded="true" aria-controls="imglist-block">
            Images
        </a>
    </div>
    <div id="imglist-block" className="collapse in show">
        <div className="card-block">

        <Thumbnail/>
        <Thumbnail/>
        <Thumbnail/>
        <Thumbnail/>


        </div>
    </div>
</div>
        );
    }

}