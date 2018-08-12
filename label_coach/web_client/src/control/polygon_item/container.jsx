import PolygonItemP from "./presenter";
import {connect} from "react-redux";
import {lockPolygon, unlockPolygon} from "./actions";
import {toggleLabelButton} from "../create_poly_button/actions";

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        editPoly: (label_id, poly_id) => {
            dispatch(unlockPolygon(label_id, poly_id))
        },
        donePoly: (label_id, poly_id) => {
            dispatch(lockPolygon(label_id, poly_id))
        },
        doneCreatePoly: (label_id, poly_id) =>{
            dispatch(lockPolygon(label_id, poly_id));
            dispatch(toggleLabelButton(label_id));
        }
    };
}

const PolygonItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(PolygonItemP);

export default PolygonItem;