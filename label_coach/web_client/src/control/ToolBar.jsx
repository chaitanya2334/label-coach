import * as React from "react";
import "../styles/ToolBar.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faRobot} from '@fortawesome/free-solid-svg-icons';
import {faCircle, faCog, faSearchMinus, faSearchPlus, faPencilAlt, faDrawPolygon, faDrawSquare, faHome, faBrush, faEdit,faBox,faSave, faEraser} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import {Button, OverlayTrigger, Tooltip , ButtonToolbar} from 'react-bootstrap';
import SaveIndicator from "./SaveIndicator";
import CreateBrushButton from "./CreateBrushButton";

class ToolBarP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <div className="toolbar">
                <ButtonToolbar justified="true">
                    <Button id="full-page"  bsStyle='default' bsSize='large'><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="expand-arrows-alt" className="svg-inline--fa fa-expand-arrows-alt fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M448.1 344v112c0 13.3-10.7 24-24 24h-112c-21.4 0-32.1-25.9-17-41l36.2-36.2L224 295.6 116.8 402.9 153 439c15.1 15.1 4.4 41-17 41H24c-13.3 0-24-10.7-24-24V344c0-21.4 25.9-32.1 41-17l36.2 36.2L184.5 256 77.2 148.7 41 185c-15.1 15.1-41 4.4-41-17V56c0-13.3 10.7-24 24-24h112c21.4 0 32.1 25.9 17 41l-36.2 36.2L224 216.4l107.3-107.3L295.1 73c-15.1-15.1-4.4-41 17-41h112c13.3 0 24 10.7 24 24v112c0 21.4-25.9 32.1-41 17l-36.2-36.2L263.6 256l107.3 107.3 36.2-36.2c15.1-15.2 41-4.5 41 16.9z"/></svg></Button>
                    <Button id="zoom-in" bsStyle='default' bsSize='large'><FontAwesomeIcon icon={faSearchPlus}/></Button>
                    <Button id="zoom-out" bsStyle='default' bsSize='large'><FontAwesomeIcon icon={faSearchMinus}/></Button>
                    <Button id="reset" bsStyle='default' bsSize='large'><FontAwesomeIcon icon={faHome}/></Button>
                    <CreateBrushButton/>
                    <Button id="erase" bsStyle='default' bsSize='large'><FontAwesomeIcon icon={faEraser}/></Button>
                </ButtonToolbar>

                <SaveIndicator/>

            </div>
        );
    }
}



// ---------- Container ----------

function mapStateToProps(state) {
    return{};
}

function mapDispatchToProps(dispatch) {
    return {};
}

const ToolBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBarP);

export default ToolBar;
