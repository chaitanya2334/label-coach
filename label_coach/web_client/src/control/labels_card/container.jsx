import LabelsCardP from "./presenter";
import {connect} from "react-redux";



function mapStateToProps(state) {
    return{};
}

function mapDispatchToProps(dispatch) {
    return {};
}

const LabelsCard = connect(
    mapStateToProps,
    mapDispatchToProps
    )(LabelsCardP);

export default LabelsCard;