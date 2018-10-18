import React from 'react';
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

let counter = 0;

function createData(name) {
    counter += 1;
    return {id: counter, name};
}

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

const rows = [
    {id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)'},
];

export class EnhancedTableHead extends React.Component {
    createSortHandler(property) {
        return event => {
            this.props.onRequestSort(event, property);
        }
    }

    handleChangePage(event, page) {
        this.setState({page});
    };

    handleChangeRowsPerPage(event) {
        this.setState({rowsPerPage: event.target.value});
    };

    render() {
        const {onSelectAllClick, numSelected, rowCount} = this.props;
        let highlight = numSelected > 0 ? "tb-highlight-light" : "";
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox className="color-green"
                                  indeterminate={numSelected > 0 && numSelected < rowCount}
                                  checked={numSelected === rowCount}
                                  onChange={onSelectAllClick}
                        />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                        {numSelected > 0 ? (
                            <Typography color="inherit" variant="subtitle1">
                                {numSelected} selected
                            </Typography>
                        ) : (
                            <Typography variant="h6" id="tableTitle">
                                Annotations
                            </Typography>
                        )}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none"/>
                    <TableCell component="th" scope="row" padding="none">
                        {numSelected > 0 ? (
                            <Tooltip title="Delete">
                                <IconButton aria-label="Delete">
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

export class EnhancedTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'calories',
            selected: [],
            data: [
                createData('Cupcake'),
                createData('Donut'),
                createData('Eclair'),
                createData('Frozen yoghurt'),
                createData('Gingerbread'),
                createData('Honeycomb'),
                createData('Ice cream sandwich'),
                createData('Jelly Bean'),
                createData('KitKat'),
                createData('Lollipop'),
                createData('Marsh'),
                createData('Nougat'),
                createData('Oreo'),
            ],
            page: 0,
            rowsPerPage: 5,
        };
    }


    handleRequestSort(event, property) {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    }

    handleSelectAllClick(event) {
        if (event.target.checked) {
            this.setState(state => ({selected: state.data.map(n => n.id)}));
            return;
        }
        this.setState({selected: []});
    }

    handleClick(event, id) {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({selected: newSelected});
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
        return this.state.selected.indexOf(id) !== -1;
    };

    render() {
        const {data, order, mouseOver, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Paper className="tb-root" elevation={0} square={true}>
                <div className="tb-wrapper">

                    <Table className="tb-table" aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            onSelectAllClick={this.handleSelectAllClick}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                <Checkbox checked={isSelected} onClick={event => this.handleClick(event, n.id)}/>
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">

                                                <Tooltip title="Edit" >
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
                    rowsPerPage={rowsPerPage}
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