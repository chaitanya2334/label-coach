import React from "react";
import _ from "lodash";
import RGL, {WidthProvider} from "react-grid-layout";
import {connect} from "react-redux";
import "../styles/CollectionGrid.css"
import Assignment from "./Assignment";
import {findAssignments} from "./browserActions";
import ItemViewer from "../control/ItemViewer/ItemViewer";

const ReactGridLayout = WidthProvider(RGL);

class AssignmentGridP extends React.PureComponent {

    constructor(props) {
        super(props);
        this.props.findAssignments();

    }

    genItems() {
        let rows = [];
        if (this.props.assignments.length > 0) {
            this.props.assignments.forEach((assignment, i) => {
                rows.push(
                    <Assignment key={assignment.id} id={assignment.id} imageFolder={assignment.imageFolder}
                                labelFolders={assignment.labelFolders} title={assignment.name} fixedWidth={true}/>
                );
            });
        }
        return rows;
    }

    render() {
        return (
            <ItemViewer>
                {this.genItems()}
            </ItemViewer>
        );
    }
}

// ---------- Container ----------

function getSearchAssignment(assignments, searchTerm) {
    return assignments.filter(assignments => assignments.name.match(searchTerm));
}

function mapStateToProps(state) {
    return {
        id: state,
        assignments: getSearchAssignment(state.assignments, "")
    }
}

function mapDispatchToProps(dispatch) {
    return {
        findAssignments: (id) => {
            dispatch(findAssignments(id))
        }
    };
}


const AssignmentGrid = connect(
    mapStateToProps,
    mapDispatchToProps
)(AssignmentGridP);

export default AssignmentGrid;