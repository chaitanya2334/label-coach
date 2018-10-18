import * as React from "react";
import "../../styles/LabelContainer.css"
import {connect} from "react-redux";
import Label from "../Label";


export class LabelContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.labels.length > 0) {
            this.props.labels.forEach((label, i) => {
                rows.push(
                    <Label key={label.id} id={label.id} name={label.name} color={label.color} expanded={label.expanded}
                           lineButtonState={label.line_button} polyButtonState={label.poly_button}
                           polygons={label.polygons} lines={label.lines}/>
                );
            });
        }
        return (
            <div className="label-container">
                {rows}
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

export const LabelContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelContainerP);