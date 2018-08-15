import ThumbnailP from "./presenter";
import {connect} from "react-redux";



function mapStateToProps(state) {
    return{};
}

function mapDispatchToProps(dispatch) {
    return {};
}

const Thumbnail = connect(
    mapStateToProps,
    mapDispatchToProps
)(ThumbnailP);

export default Thumbnail;