import * as React from "react";
import "../styles/BrushPreview.css"

export default class BrushPreviewP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <svg viewBox="0 0 150 150" className={"brush-preview"}>
                <circle cx="75" cy="75" r={this.props.size} stroke="black" strokeWidth="1" fill={this.props.color}/>
            </svg>
        );
    }

}