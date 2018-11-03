import * as React from "react";
import "../../styles/LabelContainer.css"
import {connect} from "react-redux";
import {LabelContainerP} from "./LabelContainer";


export class AnnotatorContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.annotators.length > 0) {
            this.props.annotators.forEach((annotator, i) => {
                rows.push(
                    <LabelContainerP labels={annotator.labels}/>
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
        annotators: state.adminData.annotators
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

export const AnnotatorContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnnotatorContainerP);