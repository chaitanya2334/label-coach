
import {connect} from "react-redux";
import {toggleLabelButton} from "../actions";
import CreateLineButtonP from "./presenter";

function mapStateToProps(state, ownProps){
    return state;
}

function mapDispatchToProps(dispatch, ownProps){
    return{
        addLine: ()=>{dispatch(addLine(ownProps.label.id))},
        cancelLine: ()=>{dispatch(cancelLine(ownProps.label.id))},
        toggleText: ()=>{dispatch(toggleLabelButton(ownProps.label.id, "line_button"))}
    }
}

const CreateLineButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateLineButtonP);

export default CreateLineButton;