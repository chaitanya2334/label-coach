
import CreatePolyButtonP from "./presenter";
import {connect} from "react-redux";
import {toggleLabelButton} from "../actions";
import {addAnnotation, cancelAnnotation} from "../../annotation/actions";

function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch, ownProps){
    return{
        addPoly: ()=>{dispatch(addAnnotation("polygon", ownProps.label.id))},
        cancelPoly: ()=>{dispatch(cancelAnnotation("polygon", ownProps.label.id))},
        toggleText: ()=>{dispatch(toggleLabelButton(ownProps.label.id, "poly_button"))}
    }
}

const CreatePolyButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreatePolyButtonP);

export default CreatePolyButton;

