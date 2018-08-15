import * as React from "react";
import ImageP from "../image/presenter";
import "./style.css"

export default class ImageContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.images.length > 0) {
            this.props.images.forEach((image, i) => {
                rows.push(
                    <li className={"image-item"}>
                        <ImageP key={image.id} id={image.id} active={image.active} title={image.title}
                                resPath={image.resPath}/>
                    </li>
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