import React from 'react';
import {connect} from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import LabelOutlineIcon from '@material-ui/icons/LabelOutlined';
import LabelIcon from '@material-ui/icons/Label';
import "../../styles/EnhancedTable.css"
import {
    changePage,
} from "../controlActions";

import {hideAllAnnotations, hideAnnotation, showAllAnnotations, showAnnotation} from "./AdminActions";
import {AdminTableHead} from "./AdminTableHead";

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

class AdminTableP extends React.Component {
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
    }


    handleClick(event, id, data, displayed) {
        const displayedIndex = displayed.indexOf(id);
        if (displayedIndex === -1) {
            this.props.show(data[id].ann_type, data[id].item_id);
        } else {
            this.props.hide(data[id].ann_type, data[id].item_id);
        }
    }

    onMouseEnter(event, id) {
        this.setState({mouseOver: id});
    }

    onMouseLeave(event, id) {
        if (this.state.mouseOver === id) {
            this.setState({mouseOver: ""});
        }
    }

    static isDisplayed(displayed, id) {
        return displayed.indexOf(id) !== -1;
    };

    static collectAnnotation(anns) {
        let ret = [];
        let i = 0;
        for (let ann_type in anns) {
            if (anns.hasOwnProperty(ann_type)) {
                for (let ann of anns[ann_type]) {
                    ret.push({
                                 id: i,
                                 name: ann.text,
                                 displayed: ann.displayed,
                                 ann_type: ann_type,
                                 item_id: ann.id
                             });
                    i++;
                }
            }
        }
        return ret;
    }

    static collectDisplayed(data) {
        let ret = [];
        for (let item of data) {
            if (item.displayed) {
                ret.push(item.id);
            }
        }
        return ret;
    }

    render() {
        let data = AdminTableP.collectAnnotation(this.props.label.ann);
        let displayed = AdminTableP.collectDisplayed(data);
        let page = this.props.label.page;
        const {mouseOver} = this.state;
        const emptyRows = this.rowsPerPage - Math.min(this.rowsPerPage, data.length - page * this.rowsPerPage);

        return (
            <Paper className="tb-root" elevation={0} square={true}>
                <div className="tb-wrapper">

                    <Table className="tb-table" aria-labelledby="tableTitle">
                        <AdminTableHead
                            label_id={this.props.label_id}
                            selected={displayed}
                            onDelete={(event, ids) => {
                                this.onDelete(event, ids)
                            }}
                            user_id={this.props.user_id}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {stableSort(data, getSorting(this.order, this.orderBy))
                                .slice(page * this.rowsPerPage, page * this.rowsPerPage + this.rowsPerPage)
                                .map(n => {
                                    const isDisplayed = AdminTableP.isDisplayed(displayed, n.id);
                                    const mouseOverClass = mouseOver === n.id ? "tb-mouse-over" : "tb-hidden";
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isDisplayed}
                                            tabIndex={-1}
                                            key={n.id}
                                            selected={isDisplayed}
                                            onMouseEnter={event => this.onMouseEnter(event, n.id)}
                                            onMouseLeave={event => this.onMouseLeave(event, n.id)}
                                        >
                                            <TableCell padding="checkbox">

                                                <Checkbox checked={isDisplayed} icon={<LabelOutlineIcon/>}
                                                          checkedIcon={<LabelIcon/>}
                                                          onClick={event => this.handleClick(event, n.id, data, displayed)}/>

                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">

                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">

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


function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        show: (ann_type, item_id) => {
            dispatch(showAnnotation(ownProps.user_id, ownProps.label_id, ann_type, item_id))
        },
        hide: (ann_type, item_id) => {
            dispatch(hideAnnotation(ownProps.user_id, ownProps.label_id, ann_type, item_id))
        },
        changePage: (page) => {
            dispatch(changePage(ownProps.user_id, ownProps.label_id, page));
        },
        showAll: () => {
            dispatch(showAllAnnotations(ownProps.user_id, ownProps.label_id));
        },
        hideAll: () => {
            dispatch(hideAllAnnotations(ownProps.user_id, ownProps.label_id));
        },
    }
}

export const AdminTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminTableP);
