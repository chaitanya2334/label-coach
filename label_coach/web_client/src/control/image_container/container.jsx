import {connect} from "react-redux";
import ImageContainerP from "../image_container/presenter";

function getSearchLabels(images, searchTerm){
    return images.filter(image => image.title.match(searchTerm));
}

function mapStateToProps(state) {
    return{
        images: getSearchLabels(state.images, state.searchImages)
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

const ImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageContainerP);

export default ImageContainer;