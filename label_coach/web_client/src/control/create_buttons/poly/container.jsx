import {addPolygon, cancelPolygon, unlockPolygon} from "../../polygon_item/actions";
import CreatePolyButtonP from "./presenter";
import {connect} from "react-redux";
import {toggleLabelButton} from "../actions";

function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch, ownProps){
    return{
        addPoly: ()=>{dispatch(addPolygon(ownProps.label.id))},
        cancelPoly: ()=>{dispatch(cancelPolygon(ownProps.label.id))},
        toggleText: ()=>{dispatch(toggleLabelButton(ownProps.label.id, "poly_button"))}
    }
}

const CreatePolyButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreatePolyButtonP);

export default CreatePolyButton;

