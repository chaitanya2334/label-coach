import * as React from "react";
import {connect} from "react-redux";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import SizeControl from "../SizeControl";
import "../../styles/EraserContainer.css";
import EraserLabel from "./EraserLabel";

export class EraserContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.labels.length > 0) {
            this.props.labels.forEach((label, i) => {
                rows.push(
                    <EraserLabel key={label.id} id={label.id} name={label.name} color={label.color}
                                active={label.active}/>
                );
            });
        }
        return (
            <div className="brush-container">
                <List component="nav" subheader={<ListSubheader component="div">Select Label to Erase</ListSubheader>}>
                    {rows}
                </List>
                <div className={"flex-end"}>
                    <Divider/>
                    <SizeControl className="flex-center" type="eraser"/>
                </div>
            </div>
        );
    }
}


// ---------- Container ----------

function getSearchLabels(labels, searchTerm) {
    return labels.filter(item => item.name.match(searchTerm));
}

function mapStateToProps(state) {
    return {
        labels: getSearchLabels(state.labels, state.searchLabels)
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

export const EraserContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EraserContainerP);