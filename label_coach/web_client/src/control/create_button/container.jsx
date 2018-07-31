import {addPolygon, cancelPolygon} from "../polygon_item/actions";
import CreateButtonP from "./presenter";
import {connect} from "react-redux";
import {toggleLabelButton} from "./actions";

function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch, ownProps){
    return{
        addPoly: ()=>{dispatch(addPolygon(ownProps.label))},
        cancelPoly: ()=>{dispatch(cancelPolygon(ownProps.label))},
        toggleText: ()=>{dispatch(toggleLabelButton(ownProps.label))}
    }
}

const CreateButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateButtonP);

export default CreateButton;

