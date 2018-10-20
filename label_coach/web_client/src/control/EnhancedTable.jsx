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
    changePage,
    deselectAllAnnotations,
    deselectAnnotation,
    selectAllAnnotations,
    selectAnnotation,
    selectLabel
} from "./controlActions";
import {EnhancedTableHead} from "./EnhancedTableHead";

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableP extends React.Component {
    constructor(props) {
        super(props);
        this.order = 'asc';
        this.orderBy = 'calories';
        this.rowsPerPage = 5;
        this.state = {
            mouseOver: ""
        };

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChangePage(event, page) {
        this.props.changePage(page);
    };


    handleClick(event, id) {
        const {data, selected} = this.props;
        const selectedIndex = selected.indexOf(id);
        if (selectedIndex === -1) {
            this.props.select(data[id].ann_type, data[id].item_id);
        } else {
            this.props.deselect(data[id].ann_type, data[id].item_id);
        }
    };

    onMouseEnter(event, id) {
        this.setState({mouseOver: id});
    }

    onMouseLeave(event, id) {
        if (this.state.mouseOver === id) {
            this.setState({mouseOver: ""});
        }
    }


    isSelected(id) {
        return this.props.selected.indexOf(id) !== -1;
    };

    render() {
        const {data, selected, page} = this.props;
        const {mouseOver} = this.state;
        const emptyRows = this.rowsPerPage - Math.min(this.rowsPerPage, data.length - page * this.rowsPerPage);

        return (
            <Paper className="tb-root" elevation={0} square={true}>
                <div className="tb-wrapper">

                    <Table className="tb-table" aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            label_id={this.props.label_id}
                            numSelected={selected.length}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {stableSort(data, getSorting(this.order, this.orderBy))
                                .slice(page * this.rowsPerPage, page * this.rowsPerPage + this.rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    const mouseOverClass = mouseOver === n.id ? "tb-mouse-over" : "tb-hidden";
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n.id}
                                            selected={isSelected}
                                            onMouseEnter={event => this.onMouseEnter(event, n.id)}
                                            onMouseLeave={event => this.onMouseLeave(event, n.id)}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected}
                                                          onClick={event => this.handleClick(event, n.id)}/>
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">

                                                <Tooltip title="Edit">
                                                    <IconButton className={mouseOverClass} aria-label="Edit">
                                                        <EditIcon/>
                                                    </IconButton>
                                                </Tooltip>


                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                <Tooltip title="Delete" className={mouseOverClass}>
                                                    <IconButton className={mouseOverClass} aria-label="Delete">
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Tooltip>

                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 49 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    component="div"
                    count={data.length}
                    rowsPerPage={this.rowsPerPage}
                    rowsPerPageOptions={[]}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                />
            </Paper>
        );
    }
}

// ---------- Container ----------
function collectAnnotation(anns) {
    let ret = [];
    let i = 0;
    for (let ann_type in anns) {
        if (anns.hasOwnProperty(ann_type)) {
            for (let ann of anns[ann_type]) {
                ret.push({
                             id: i,
                             name: ann.text,
                             selected: ann.selected,
                             ann_type: ann_type,
                             item_id: ann.id
                         });
                i++;
            }
        }
    }
    return ret;
}

function collectSelected(data) {
    let ret = [];
    for (let item of data) {
        if (item.selected) {
            ret.push(item.id);
        }
    }
    return ret;
}

function mapStateToProps(state, ownProps) {
    let data = collectAnnotation(state.labels[ownProps.label_id].ann);
    return {
        data: data,
        selected: collectSelected(data),
        page: state.labels[ownProps.label_id].page
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        select: (ann_type, item_id) => {
            dispatch(selectAnnotation(ownProps.label_id, ann_type, item_id))
        },
        deselect: (ann_type, item_id) => {
            dispatch(deselectAnnotation(ownProps.label_id, ann_type, item_id))
        },
        changePage: (page) => {
            dispatch(changePage(ownProps.label_id, page));
        }
    }
}

export const EnhancedTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(EnhancedTableP);