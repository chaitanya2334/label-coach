import * as React from "react";
import {AdminTable} from "./AdminTable";
import connect from "react-redux/es/connect/connect";
import {hideAnnotation, expandAdminLabel, showAnnotation} from "./AdminActions";
import Label from "../Label";
import {changePage} from "../controlActions";
class ViewLabelP extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Label label={this.props.label} expandLabel={this.props.expandLabel}>
                <AdminTable label_id={this.props.label.id} label={this.props.label} user_id={this.props.user_id}/>
            </Label>
        );
    }
}

// ---------- Container ----------

function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        expandLabel: (label_id, state)=>{
            dispatch(expandAdminLabel(ownProps.user_id, label_id, state));
        },

    }
}

const ViewLabel = connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewLabelP);

export default ViewLabel;