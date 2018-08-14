import PolygonItemP from "./presenter";
import {connect} from "react-redux";
import {lockAnnotation, unlockAnnotation} from "../actions";
import {toggleLabelButton} from "../../create_buttons/actions";

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        editPoly: (label_id, poly_id) => {
            dispatch(unlockAnnotation("polygon", label_id, poly_id))
        },
        donePoly: (label_id, poly_id) => {
            dispatch(lockAnnotation("polygon", label_id, poly_id))
        },
        doneCreatePoly: (label_id, poly_id) =>{
            dispatch(lockAnnotation("polygon", label_id, poly_id));
            dispatch(toggleLabelButton(label_id, "poly_button"));
        }
    };
}

const PolygonItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(PolygonItemP);

export default PolygonItem;