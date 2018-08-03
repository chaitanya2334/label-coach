import * as React from "react";

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
            card block
        </div>
    </div>
</div>
        );
    }

}