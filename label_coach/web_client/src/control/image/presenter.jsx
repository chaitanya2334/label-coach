import * as React from "react";
import "./style.css";

export default class ImageP extends React.Component {
    constructor(props) {
        super(props);

    }

    getThumbnailPath(){
        return this.props.resPath + "_files/8/0_0.jpeg";
    }

    render() {
        let thumbnailPath = this.getThumbnailPath();
        return (
            <div className={"image-card"}>
                <div className={"title"}>
                    {this.props.title}
                </div>
                <div className="l-img-thumbnail">
                    <img src={thumbnailPath}/>
                </div>

            </div>
        );
    }

}