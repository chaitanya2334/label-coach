import * as React from "react";
import "../styles/LabelContainer.css"
import {connect} from "react-redux";
import Label from "./Label";


export class LabelContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.labels.length > 0) {
            this.props.labels.forEach((label, i) => {
                rows.push(
                    <li className={"label-item"}>
                        <Label key={label.id} id={label.id} text={label.text} color={label.color} active={label.active}
                               lineButtonState={label.line_button} polyButtonState={label.poly_button}
                               polygons={label.polygons} lines={label.lines}/>
                    </li>
                );
            });
        }
        return (
            <ul className="label-container">
                {rows}
            </ul>
        );
    }
}

// ---------- Container ----------

function getSearchLabels(labels, searchTerm) {
    return labels.filter(item => item.text.match(searchTerm));
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