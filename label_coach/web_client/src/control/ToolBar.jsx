import * as React from "react";

import {
    faDrawSquare,

} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import {ButtonToolbar} from 'react-bootstrap';

import CreateBrushButton from "./CreateBrushButton";
import "../styles/ToolBar.css";
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import HomeIcon from "@material-ui/icons/Home";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import {addAnnotation, setHeader, setLabelBarVisibility, setThumbnailBarVisibility} from "./controlActions";

class ToolBarP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alignment: []
        };
        this.handleMovement = this.handleMovement.bind(this);
        this.handleDrawTools = this.handleDrawTools.bind(this);
        this.handleSidebars = this.handleSidebars.bind(this);
        this.toggleHeader = this.toggleHeader.bind(this);
    }

    handleMovement(event, movement) {
        this.setState({movement})
    }

    handleDrawTools(event, drawTools) {
        this.setState({drawTools})
    }

    handleSidebars(event, sidebars) {
        let labelBarVis = false;
        let thumbnailBarVis = false;
        if (sidebars !== null) {
            for (let sidebar of sidebars) {
                switch (sidebar) {
                    case "review":
                        labelBarVis = true;
                        break;
                    case "thumbnail":
                        thumbnailBarVis = true;
                        break;
                }
            }
        }
        this.props.setLabelBar(labelBarVis);
        this.props.setThumbnailBar(thumbnailBarVis);
        this.setState({sidebars});
    }

    toggleHeader(event, header) {
        this.props.setHeader(!this.props.showHeader);
    }

    render() {
        const {movement, drawTools, sidebars} = this.state;
        let arrow;
        if (this.props.showHeader) {
            arrow = <KeyboardArrowUpIcon/>
        } else {
            arrow = <KeyboardArrowDownIcon/>
        }
        return (
            <div className={"full-toolbar"}>
                <div className="toolbar">
                    <ToggleButtonGroup value={movement} onChange={this.handleMovement}>
                        <ToggleButton value="zoom-map" id="full-page"
                                      size="small"><ZoomOutMapIcon/></ToggleButton>
                        <ToggleButton value="zoom-in" id="zoom-in"
                                      size="small"><ZoomInIcon/></ToggleButton>
                        <ToggleButton value="zoom-out" id="zoom-out"
                                      size="small"><ZoomOutIcon/></ToggleButton>
                        <ToggleButton value="home" id="home" size="small"><HomeIcon/></ToggleButton>
                    </ToggleButtonGroup>
                    <Divider className={"vertical-divider"}/>
                    <ToggleButtonGroup exclusive value={drawTools} justified="true" onChange={this.handleDrawTools}>
                        <CreateBrushButton/>
                        <ToggleButton value="clear" id="erazer"
                                      size="small"><ClearIcon/></ToggleButton>
                    </ToggleButtonGroup>
                    <Divider className={"vertical-divider"}/>
                    <ToggleButtonGroup value={sidebars} onChange={this.handleSidebars}>
                        <ToggleButton value="thumbnail" id="thumbnail" size="small"
                                      className="text-btn">Thumbnail</ToggleButton>
                        <ToggleButton value="review" id="review" size="small" className="text-btn">Review</ToggleButton>
                    </ToggleButtonGroup>

                </div>
                <Button size={"small"} id="showHeader" className={"btn-small"} onClick={this.toggleHeader}
                        style={{justifySelf: "flex-end"}}>
                    {arrow}
                </Button>
            </div>
        );
    }
}


// ---------- Container ----------

function mapStateToProps(state) {
    return {
        showHeader: state.showHeader
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setThumbnailBar: (state) => {
            dispatch(setThumbnailBarVisibility(state));
        },
        setLabelBar: (state) => {
            dispatch(setLabelBarVisibility(state));
        },
        setHeader: (state) => {
            dispatch(setHeader(state));
        }
    };
}

const ToolBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBarP);

export default ToolBar;
