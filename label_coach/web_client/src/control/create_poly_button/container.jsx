import {addPolygon, cancelPolygon, unlockPolygon} from "../polygon_item/actions";
import CreateButtonP from "./presenter";
import {connect} from "react-redux";
import {toggleLabelButton} from "./actions";

function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch, ownProps){
    return{
        addPoly: ()=>{dispatch(addPolygon(ownProps.label.id))},
        cancelPoly: ()=>{dispatch(cancelPolygon(ownProps.label.id))},
        toggleText: ()=>{dispatch(toggleLabelButton(ownProps.label.id))}
    }
}

const CreateButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateButtonP);

export default CreateButton;

