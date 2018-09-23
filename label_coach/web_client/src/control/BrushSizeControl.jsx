import * as React from "react";

import {connect} from "react-redux";

import "../styles/BrushSizeControl.css"
import 'react-input-range/lib/css/index.css';
import Slider from "@material-ui/lab/Slider";
import Typography from "@material-ui/core/Typography";
import {setBrushSize} from "./controlActions";
import BrushPreviewP from "./BrushPreview";
import Divider from "@material-ui/core/Divider";


class BrushSizesP extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, value) {
        this.props.setBrushSize(value);
    }

    render() {
        return (
            <div>
                <Typography id="label" className={"bsh-size-label"}>Brush Size: {Math.floor(this.props.brushSize)} units</Typography>
                <Slider value={this.props.brushSize} min={1} max={50} aria-labelledby="label" onChange={this.handleChange}/>
                <Divider/>
                <BrushPreviewP size={this.props.brushSize} color={this.props.labelColor}/>
            </div>

        );
    }
}

// ---------- Container ----------

function getActiveColor(labels) {
    for(let label of labels){
        if (label.active){
            return label.color;
        }
    }
    return "#ffffff";
}

function mapStateToProps(state) {
    return {
        brushSize: state.brushSize,
        labelColor: getActiveColor(state.labels)
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        setBrushSize: (value) => {
            dispatch(setBrushSize(value))
        }
    }
}

const BrushSizeControl = connect(
    mapStateToProps,
    mapDispatchToProps
)(BrushSizesP);

export default BrushSizeControl;