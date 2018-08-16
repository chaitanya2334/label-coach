import * as React from "react";
import "./style.css"
import ThumbnailP from "../thumbnail/presenter";

export default class ImageContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.images.length > 0) {
            this.props.images.forEach((image, i) => {
                rows.push(
                    <ThumbnailP key={image.id} id={image.id} active={image.active} title={image.title}
                                resPath={image.resPath}/>
                );
            });
        }
        return (
            <ul className="image-container">
                {rows}
            </ul>
        );
    }
}