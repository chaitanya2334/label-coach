import * as React from "react";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faSearchMinus,
    faSearchPlus,
    faDrawSquare,
    faHome,
    faEraser
} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import {ButtonToolbar} from 'react-bootstrap';

import SaveIndicator from "./SaveIndicator";
import CreateBrushButton from "./CreateBrushButton";
import "../styles/ToolBar.css";
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import HomeIcon from "@material-ui/icons/Home";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

class ToolBarP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <div className="toolbar">
                <ButtonToolbar className="toolbar-btns" justified="true">

                    <Button id="full-page" className="btn-small" size="small"><ZoomOutMapIcon/></Button>
                    <Button id="zoom-in" className="btn-small" size="small"><ZoomInIcon/></Button>
                    <Button id="zoom-out" className="btn-small" size="small"><ZoomOutIcon/></Button>
                    <Button id="home" className="btn-small" size="small"><HomeIcon/></Button>
                    <Divider className={"vertical-divider"}/>
                    <CreateBrushButton/>
                    <Button id="erazer" className="btn-small" size="small"><ClearIcon/></Button>

                </ButtonToolbar>

            </div>
        );
    }
}


// ---------- Container ----------

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

const ToolBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBarP);

export default ToolBar;
