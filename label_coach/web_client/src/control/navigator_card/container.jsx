import NavigatorCardP from "./presenter";
import {connect} from "react-redux";



function mapStateToProps(state) {
    return{};
}

function mapDispatchToProps(dispatch) {
    return {};
}

const NavigatorCard = connect(
    mapStateToProps,
    mapDispatchToProps
    )(NavigatorCardP);

export default NavigatorCard;