import * as React from "react";

import {connect} from "react-redux";

import "../styles/SizeControl.css"
import 'react-input-range/lib/css/index.css';
import Slider from "@material-ui/lab/Slider";
import Typography from "@material-ui/core/Typography";
import PreviewP from "./Preview";
import Divider from "@material-ui/core/Divider";
import {setSize} from "./controlActions";


class SizeControlP extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, value) {
        this.props.setSize(value);
    }

    render() {
        return (
            <div>
                <Typography id="label" className={"bsh-size-label"}>{this.props.type} Size: {Math.floor(this.props.size)} units</Typography>
                <Slider value={this.props.size} min={1} max={50} aria-labelledby="label" onChange={this.handleChange}/>
                <Divider/>
                <PreviewP size={this.props.size} color={this.props.labelColor}/>
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

function mapStateToProps(state, ownProps) {
    return {
        size: state.tools[ownProps.type].size || 10,
        labelColor: getActiveColor(state.labels)
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        setSize: (value) => {
            dispatch(setSize(ownProps.type, value))
        }
    }
}

const SizeControl = connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeControlP);

export default SizeControl;