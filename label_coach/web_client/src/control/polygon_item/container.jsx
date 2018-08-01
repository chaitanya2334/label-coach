import PolygonItemP from "./presenter";
import {connect} from "react-redux";
function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch){
    return {};
}

const PolygonItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(PolygonItemP);

export default PolygonItem;