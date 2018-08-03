import ToolBarP from "./presenter";
import {connect} from "react-redux";



function mapStateToProps(state) {
    return{};
}

function mapDispatchToProps(dispatch) {
    return {};
}

const ToolBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBarP);

export default ToolBar;