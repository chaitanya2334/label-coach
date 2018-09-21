import * as React from "react";
import "../styles/LabelContainer.css"
import {connect} from "react-redux";
import BrushLabel from "./BrushLabel";
import BrushSizes from "./BrushSizes";


export class BrushLabelContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.labels.length > 0) {
            this.props.labels.forEach((label, i) => {
                rows.push(
                    <div className={"label-item col-md-3"}>
                        <BrushLabel key={label.id} id={label.id} name={label.name} color={label.color} active={label.active}/>
                    </div>
                );
            });
        }
        return (
            <div className="brush-label-container">
                <div className={"row"}>
                    <div className={"col-md-6"}>
                        <div className={"row"}>

                        </div>
                        <div className={"row"}>
                            <BrushSizes/>
                        </div>
                    </div>
                    <div className={"col-md-6"}>
                        <div className={"row"}>
                            {rows}
                        </div>
                    </div>
                </div>
                <div className={"row"}>
                    <input className="form-control" type="text" placeholder="Readonly input here…" readOnly/>
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

export const BrushLabelContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BrushLabelContainerP);