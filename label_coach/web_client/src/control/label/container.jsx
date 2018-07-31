import {toggleLabel} from "./actions";
import LabelP from "./presenter";
import {connect} from "react-redux";
function mapStateToProps(state){
    return state
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        onClick: ()=>{dispatch(toggleLabel(ownProps))}
    }
}

const Label = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelP);

export default Label;