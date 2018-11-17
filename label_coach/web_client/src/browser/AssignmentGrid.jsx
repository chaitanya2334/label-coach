import React from "react";
import _ from "lodash";
import RGL, {WidthProvider} from "react-grid-layout";
import {connect} from "react-redux";
import Thumbnail from "../control/Thumbnail";
import "../styles/AssignmentGrid.css"
import Assignment from "./Assignment";
import {findAssignments} from "./browserActions"
import InfiniteScroll from 'react-infinite-scroller'

const ReactGridLayout = WidthProvider(RGL);

class AssignmentGridP extends React.PureComponent {

    constructor(props) {
        super(props);
        this.props.findAssignments();

    }

    genAssignments() {
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
        const loader = <div className="loader">Loading ...</div>;

        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.props.findAssignments}
                hasMore={this.props.hasMore}
                loader={loader}
            >
                <div className="grid_layout">
                    {this.genAssignments()}
                </div>
            </InfiniteScroll>

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
        assignments: getSearchAssignment(state.assignments, ""),
        hasMore: state.hasMoreAssignments
    }
}

function mapDispatchToProps(dispatch) {
    return {
        findAssignments: (page) => {
            dispatch(findAssignments(10, page - 1))
        }
    };
}


const AssignmentGrid = connect(
    mapStateToProps,
    mapDispatchToProps
)(AssignmentGridP);

export default AssignmentGrid;