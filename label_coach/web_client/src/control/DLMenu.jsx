import * as React from "react";
import {connect} from "react-redux";
import ToggleButton from "@material-ui/lab/ToggleButton";
import GetAppIcon from "@material-ui/icons/GetApp";
import Tooltip from "@material-ui/core/Tooltip";
import {downloadImageLabels} from "./controlActions";


class DLMenuP extends React.Component {
    render() {
        return (
            <div>
                <Tooltip title="Download Label Annotations" enterDelay={500} leaveDelay={200}>
                    <ToggleButton
                        size="small"
                        value="DLMenu"
                        aria-owns={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        href={"api/v1/labelImage/download?assign_id=" + encodeURIComponent(this.props.assign_id) + "&image_name=" +
                        encodeURIComponent(this.props.image_name)}
                    >
                        <GetAppIcon/>
                    </ToggleButton>
                </Tooltip>
            </div>
        );
    }
}

// ---------- Container ----------


function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
    }
}

export const DLMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(DLMenuP);