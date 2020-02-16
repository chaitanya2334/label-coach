import * as React from "react";

import {
    faDrawPolygon,

} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import "../styles/ToolBar.css";
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import HomeIcon from "@material-ui/icons/Home";
import CachedIcon from "@material-ui/icons/Cached";
import CreateIcon from "@material-ui/icons/Create";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import {
    addAnnotation,
    setHeader,
    selectRightBar,
    setThumbnailBarVisibility,
    setNavState,
    setDirtyStatus, resetViewer
} from "./controlActions";
import SvgIcon from "@material-ui/core/SvgIcon";
import BrushIcon from "../../../node_modules/@material-ui/icons/Brush";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SaveIcon from '@material-ui/icons/Save';
import {lockAllAnnotations, setOutline, setSaveStatus} from "./controlActions";
import {DLMenu} from "./DLMenu";

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
        if (movement.length !== 0 && movement[0] === "reset") {
            this.props.resetViewer()
        }
    }

    handleDrawTool(event, drawTool) {
        if (drawTool) {
            this.props.setNavState(false);
        } else {
            this.props.setNavState(true);
        }
        this.props.selectRightBar(drawTool);
    }

    handleSidebars(event, sidebars) {
        let rightBar = "";
        let thumbnailBarVis = false;
        if (sidebars !== null) {
            for (let sidebar of sidebars) {
                switch (sidebar) {
                    case "review":
                        rightBar = "labels";
                        this.props.setNavState(true);
                        break;
                    case "thumbnail":
                        thumbnailBarVis = true;
                        this.props.setNavState(true);
                        break;
                }
            }
        }
        this.props.selectRightBar(rightBar);
        this.props.setThumbnailBar(thumbnailBarVis);
    }

    toggleHeader(event, header) {
        this.props.setHeader(!this.props.showHeader);
    }

    render() {

        let arrow;
        if (this.props.showHeader) {
            arrow = <KeyboardArrowUpIcon/>
        } else {
            arrow = <KeyboardArrowDownIcon/>
        }
        return (
            <div className={"full-toolbar"}>
                <div className="toolbar" white-space="nowrap">
                    <ToggleButtonGroup className="tbg" onChange={this.handleMovement}>
                        <ToggleButton value="zoom-map" id="full-page"><ZoomOutMapIcon/></ToggleButton>
                        <ToggleButton value="zoom-in" id="zoom-in" size="large"><ZoomInIcon/></ToggleButton>
                        <ToggleButton value="zoom-out" id="zoom-out" size="small"><ZoomOutIcon/></ToggleButton>
                        <ToggleButton value="home" id="home" size="small"><HomeIcon/></ToggleButton>
                        <ToggleButton value="reset" id="reset" size="small"><CachedIcon/></ToggleButton>
                    </ToggleButtonGroup>
                    <Divider className={"vertical-divider"}/>
                    <ToggleButtonGroup className="tbg" exclusive value={this.props.drawTool} justified="true"
                                       onChange={this.handleDrawTool}>
                        <ToggleButton disabled id="brush" value="brush" className="btn-small"
                                      size="small" style={{display: "none"}}><BrushIcon/></ToggleButton>
                        <ToggleButton disabled={this.props.disable} id="line" value="line" className="btn-small"
                                      size="small"><CreateIcon/></ToggleButton>
                        <ToggleButton id="poly" value="poly" className="btn-small"
                                      size="small"><FontAwesomeIcon
                            className='icon-medium' icon={faDrawPolygon}/></ToggleButton>
                        <ToggleButton value="eraser" id="erazer" size="small">
                            <SvgIcon>
                                <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0
                                    1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83
                                    0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-4.95-4.95-4.95 4.95z"/>
                            </SvgIcon>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Divider className={"vertical-divider"}/>

                    <ToggleButton disabled={this.props.disable} value="save" id="save" size="large"
                                  onClick={this.props.save}><SaveIcon/></ToggleButton>
                    <DLMenu assign_id={this.props.currentAssignmentId} image_name={this.props.imageName}/>
                    <Divider className={"vertical-divider"}/>

                    <ToggleButtonGroup className="tbg" value={this.props.overview} onChange={this.handleSidebars}>
                        <ToggleButton value="thumbnail" id="thumbnail" size="small"
                                      className="text-btn">Thumbnail</ToggleButton>
                        <ToggleButton value="review" id="review" size="small" className="text-btn">Review</ToggleButton>
                    </ToggleButtonGroup>

                    <Divider className={"vertical-divider"}/>


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

function isAdmin(currentUser, currentAssignment) {
    if (currentUser !== undefined && currentAssignment.hasOwnProperty('owner')) {
        return currentUser._id === currentAssignment.owner._id.$oid;
    }
    return false;
}

function getId(currentAssignment) {
    if (currentAssignment.hasOwnProperty('label_folders') && currentAssignment.label_folders.length > 0) {
        return currentAssignment.label_folders[0]._id.$oid
    }
    return ""
}

function getActiveImageInfo(images) {
    let dbId = "";
    let mimeType = "";
    let title = "Untitled";

    for (let image of images) {
        if (image.active) {
            title = image.title;
            mimeType = image.mimeType;
            dbId = image.dbId;

            break;
        }
    }
    return {dbId, mimeType, title}
}

function mapStateToProps(state) {
    let overview = [];
    let drawTool = null;
    switch (state.rightBar) {
        case "labels":
            overview.push("review");
            break;
        default:
            drawTool = state.rightBar;
    }
    if (state.thumbnailBarVisibility) {
        overview.push("thumbnail");
    }

    let {dbId, mimeType, title} = getActiveImageInfo(state.images);

    return {
        showHeader: state.showHeader,
        rightBar: state.rightBar,
        currentAssignmentId: getId(state.currentAssignment),
        imageName: title,
        overview: overview,
        drawTool: drawTool,
        disable: isAdmin(state.authentication.user, state.currentAssignment)
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
            dispatch(lockAllAnnotations("brushes"));
            dispatch(setDirtyStatus());
        },
        setNavState: (state) => {
            dispatch(setNavState(state));
        },
        resetViewer: () => {
            dispatch(resetViewer());
        }
    };
}

const ToolBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBarP);

export default ToolBar;
