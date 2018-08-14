
import {connect} from "react-redux";
import {toggleLabelButton} from "../actions";
import CreateLineButtonP from "./presenter";
import {addAnnotation, cancelAnnotation} from "../../annotation/actions";

function mapStateToProps(state, ownProps){
    return state;
}

function mapDispatchToProps(dispatch, ownProps){
    return{
        addLine: ()=>{dispatch(addAnnotation("line", ownProps.label.id))},
        cancelLine: ()=>{dispatch(cancelAnnotation("line", ownProps.label.id))},
        toggleText: ()=>{dispatch(toggleLabelButton(ownProps.label.id, "line_button"))}
    }
}

const CreateLineButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateLineButtonP);

export default CreateLineButton;