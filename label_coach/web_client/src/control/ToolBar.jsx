import * as React from "react";

import {
    faDrawPolygon,

} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import {ButtonToolbar} from 'react-bootstrap';

import CreateBrushButton from "./CreateBrushButton";
import "../styles/ToolBar.css";
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import HomeIcon from "@material-ui/icons/Home";
import CreateIcon from "@material-ui/icons/Create";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import {addAnnotation, setHeader, selectRightBar, setThumbnailBarVisibility} from "./controlActions";
import SvgIcon from "@material-ui/core/SvgIcon";
import BrushIcon from "../../../node_modules/@material-ui/icons/Brush";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SaveIcon from '@material-ui/icons/Save';
import {lockAllAnnotations, setOutline, setSaveStatus} from "./controlActions";



class ToolBarP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alignment: []
        };
        this.handleMovement = this.handleMovement.bind(this);
        this.handleDrawTool = this.handleDrawTool.bind(this);
        this.handleSidebars = this.handleSidebars.bind(this);
        this.toggleHeader = this.toggleHeader.bind(this);
    }

    handleMovement(event, movement) {
        this.setState({movement})
    }

    handleDrawTool(event, drawTool) {
        this.props.selectRightBar(drawTool);
        this.setState({drawTool})
    }

    handleSidebars(event, sidebars) {
        let rightBar = "";
        let thumbnailBarVis = false;
        if (sidebars !== null) {
            for (let sidebar of sidebars) {
                switch (sidebar) {
                    case "review":
                        rightBar = "labels";
                        break;
                    case "thumbnail":
                        thumbnailBarVis = true;
                        break;
                }
            }
        }
        this.props.selectRightBar(rightBar);
        this.props.setThumbnailBar(thumbnailBarVis);
        this.setState({sidebars});
    }

    toggleHeader(event, header) {
        this.props.setHeader(!this.props.showHeader);
    }

    render() {
        let {movement, drawTool, sidebars} = this.state;
        // HAX <--- TODO remove
        if (this.props.rightBar !== "labels"){
            // remove "review" toggle as somebody else is using the rightbar
            if(sidebars) {
                sidebars = sidebars.filter(e => e !== 'review');
            }
        }else if (this.props.rightBar === "labels"){
            // remove any of the draw tool toggles as "review" is using the rightbar
            drawTool = null;
        }

        let arrow;
        if (this.props.showHeader) {
            arrow = <KeyboardArrowUpIcon/>
        } else {
            arrow = <KeyboardArrowDownIcon/>
        }
        return (
            <div className={"full-toolbar"}>
                <div className="toolbar">
                    <ToggleButtonGroup selected value={movement} onChange={this.handleMovement}>
                        <ToggleButton value="zoom-map" id="full-page" size="small"><ZoomOutMapIcon/></ToggleButton>
                        <ToggleButton value="zoom-in" id="zoom-in" size="small"><ZoomInIcon/></ToggleButton>
                        <ToggleButton value="zoom-out" id="zoom-out" size="small"><ZoomOutIcon/></ToggleButton>
                        <ToggleButton value="home" id="home" size="small"><HomeIcon/></ToggleButton>
                    </ToggleButtonGroup>
                    <Divider className={"vertical-divider"}/>

                    <ToggleButtonGroup selected exclusive value={drawTool} justified="true" onChange={this.handleDrawTool}>
                        <ToggleButton id="brush" value="brush" className="btn-small" size="small"><BrushIcon/></ToggleButton>
                        <ToggleButton id="line" value="line" className="btn-small" size="small"><CreateIcon/></ToggleButton>
                        <ToggleButton id="poly" value="poly" className="btn-small" size="large"><FontAwesomeIcon className='icon-medium' icon={faDrawPolygon}/></ToggleButton>
                        <ToggleButton value="eraser" id="erazer" size="small">
                            <SvgIcon>
                                <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0
                                    1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83
                                    0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-4.95-4.95-4.95 4.95z"/>
                            </SvgIcon>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Divider className={"vertical-divider"}/>

                    <ToggleButtonGroup selected value={sidebars} onChange={this.handleSidebars}>
                        <ToggleButton value="thumbnail" id="thumbnail" size="small" className="text-btn">Thumbnail</ToggleButton>
                        <ToggleButton value="review" id="review" size="small" className="text-btn">Review</ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButton value="save" id="save" size="small" onClick={this.props.save}><SaveIcon/> Save</ToggleButton>

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
        showHeader: state.showHeader,
        rightBar: state.rightBar,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setThumbnailBar: (state) => {
            dispatch(setThumbnailBarVisibility(state));
        },
        selectRightBar: (value) => {
            dispatch(selectRightBar(value));
        },
        setHeader: (state) => {
            dispatch(setHeader(state));
        },
        save: () => {
            dispatch(lockAllAnnotations("brush"));
            dispatch(setSaveStatus("dirty"));
        }
    };
}

const ToolBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBarP);

export default ToolBar;
