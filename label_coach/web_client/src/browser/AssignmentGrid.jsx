import React from "react";
import _ from "lodash";
import RGL, {WidthProvider} from "react-grid-layout";
import {connect} from "react-redux";
import Thumbnail from "../control/Thumbnail";
import "../styles/AssignmentGrid.css"
import Assignment from "./Assignment";
import {findAssignments, setHasMoreAssignments} from "./browserActions"
import InfiniteScroll from '../control/InfiniteScroll'

const ReactGridLayout = WidthProvider(RGL);

class AssignmentGridP extends React.PureComponent {

    constructor(props) {
        super(props);
        this.loadMore = this.loadMore.bind(this);
        this.scrollListener = this.scrollListener.bind(this);
        this.hasMore = false;

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

    componentDidMount() {
        //window.addEventListener('scroll', this.scrollListener);
    }

    calculateOffset(el, scrollTop) {
        if (!el) {
            return 0;
        }

        return (
            this.calculateTopPosition(el) +
            (el.offsetHeight - scrollTop - window.innerHeight)
        );
    }

    calculateTopPosition(el) {
        if (!el) {
            return 0;
        }
        return el.offsetTop + this.calculateTopPosition(el.offsetParent);
    }

    scrollListener() {
        const el = this.scrollComponent;
        const scrollEl = window;

        let offset;

        const doc = document.documentElement || document.body.parentNode || document.body;
        const scrollTop =
            scrollEl.pageYOffset !== undefined
                ? scrollEl.pageYOffset
                : doc.scrollTop;

        offset = this.calculateOffset(el, scrollTop);
        // Here we make sure the element is visible as well as checking the offset
        if (offset < Number(250)) {
            this.props.setHasMore(true);
        }
    }

    loadMore(page) {
        this.props.findAssignments(page);
        //this.props.setHasMore(false);
    }

    render() {
        const loader = <div className="loader">Loading ...</div>;
        this.hasMore = this.props.hasMore;
        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={this.hasMore}
                loader={loader} initialLoad={true} threshold={250}
                useWindow={true} isReverse={false} useCapture={false} getScrollParent={null}
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
            dispatch(findAssignments(25, page - 1))
        },
        setHasMore: (state) => {
            dispatch(setHasMoreAssignments(state))
        }
    };
}


const AssignmentGrid = connect(
    mapStateToProps,
    mapDispatchToProps
)(AssignmentGridP);

export default AssignmentGrid;