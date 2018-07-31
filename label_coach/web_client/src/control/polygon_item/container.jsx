import PolygonItemP from "./presenter";
import {connect} from "react-redux";
function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch){

}

const PolygonItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(PolygonItemP);

export default PolygonItem;