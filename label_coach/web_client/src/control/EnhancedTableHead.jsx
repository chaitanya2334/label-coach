import React from 'react';
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import "../styles/EnhancedTable1.css"
import Divider from "@material-ui/core/Divider";
import {
    deselectAllAnnotations,
    deselectAnnotation,
    selectAllAnnotations,
    selectAnnotation,
    selectLabel, setSaveStatus
} from "./controlActions";


class EnhancedTableHeadP extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    }


    handleSelectAllClick(event) {
        if (event.target.checked) {
            this.props.selectAll();
        } else {
            this.props.deselectAll();
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
                            <Typography color="inherit" variant="subtitle1">
                                {this.props.selected.length} selected
                            </Typography>
                        ) : (
                            <Typography variant="h6" id="tableTitle">
                                Annotations
                            </Typography>
                        )}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none"/>
                    <TableCell component="th" scope="row" padding="none">
                        {this.props.selected.length > 0 ? (
                            <Tooltip title="Delete">
                                <IconButton aria-label="Delete" onClick={event => this.props.onDelete(event, this.props.selected)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                        ) : ""}

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
        selectAll: () => {
            dispatch(selectAllAnnotations(ownProps.label_id));
        },
        deselectAll: () => {
            dispatch(deselectAllAnnotations(ownProps.label_id));
        },
        select: () => {
            dispatch(selectAnnotation(ownProps.label_id, ownProps.ann_type, ownProps.item_id))
        },
        deselect: () => {
            dispatch(deselectAnnotation(ownProps.label_id, ownProps.ann_type, ownProps.item_id));

        }
    }
}

export const EnhancedTableHead = connect(
    mapStateToProps,
    mapDispatchToProps
)(EnhancedTableHeadP);