import React from 'react';
import {connect} from "react-redux";
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import "../../styles/EnhancedTable.css"

import {hideAllAnnotations, showAllAnnotations} from "./AdminActions";


class AdminTableHeadP extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    }


    handleSelectAllClick(event) {
        if (this.props.selected.length > 0) {
            this.props.hideAll();
        } else {
            this.props.showAll();
        }
    }

    render() {

        let highlight = this.props.selected.length > 0 ? "tb-highlight-light" : "";
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox className="color-green"
                                  indeterminate={this.props.selected.length > 0 &&
                                  this.props.selected.length < this.props.rowCount}
                                  checked={this.props.selected.length === this.props.rowCount}
                                  onChange={this.handleSelectAllClick}
                        />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                        {this.props.selected.length > 0 ? (
                            <Typography color="inherit" variant={"body1"}>
                                {this.props.selected.length} selected
                            </Typography>
                        ) : (
                            <Typography variant={"body1"} id="tableTitle">
                                Annotations
                            </Typography>
                        )}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none"/>
                    <TableCell component="th" scope="row" padding="none">
                    </TableCell>
                </TableRow>
            </TableHead>

        );
    }
}

// ---------- Container ----------

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        showAll: () => {
            dispatch(showAllAnnotations(ownProps.user_id, ownProps.label_id));
        },
        hideAll: () => {
            dispatch(hideAllAnnotations(ownProps.user_id, ownProps.label_id));
        }
    }
}

export const AdminTableHead = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminTableHeadP);