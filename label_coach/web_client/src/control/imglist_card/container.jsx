import ImgListCardP from "./presenter";
import {connect} from "react-redux";



function mapStateToProps(state) {
    return{};
}

function mapDispatchToProps(dispatch) {
    return {};
}

const ImgListCard = connect(
    mapStateToProps,
    mapDispatchToProps
    )(ImgListCardP);

export default ImgListCard;