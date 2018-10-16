import * as React from "react";
import "../../styles/BrushContainer.css"
import {connect} from "react-redux";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import LabelSelector from "../LabelSelector";


export class LabelSelectorContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.labels.length > 0) {
            this.props.labels.forEach((label, i) => {
                rows.push(
                    <LabelSelector key={label.id} id={label.id} type={this.props.labelType} name={label.name} color={label.color}
                                active={label.active}/>
                );
            });
        }
        return (
            <div className="brush-container">
                <List component="nav" subheader={<ListSubheader component="div">Select Label to Annotate</ListSubheader>}>
                    {rows}
                </List>
                <div className={"flex-end"}>
                    <Divider/>
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

export const LabelSelectorContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelSelectorContainerP);