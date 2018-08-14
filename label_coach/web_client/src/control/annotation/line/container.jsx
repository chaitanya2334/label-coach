
import {connect} from "react-redux";
import {lockAnnotation, unlockAnnotation} from "../actions";
import {toggleLabelButton} from "../../create_buttons/actions";
import LineItemP from "./presenter";

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        editLine: (label_id, line_id) => {
            dispatch(unlockAnnotation("line", label_id, line_id))
        },
        doneLine: (label_id, line_id) => {
            dispatch(lockAnnotation("line", label_id, line_id))
        },
        doneCreateLine: (label_id, line_id) =>{
            dispatch(lockAnnotation("line", label_id, line_id));
            dispatch(toggleLabelButton(label_id, "line_button"));
        }
    };
}

const LineItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(LineItemP);

export default LineItem;