import * as React from "react";
import "../styles/ImageContainer.css"
import {connect} from "react-redux";
import Thumbnail from "./Thumbnail";


class ImageContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.images.length > 0) {
            this.props.images.forEach((image, i) => {
                rows.push(
                    <Thumbnail key={image.id} id={image.id} active={image.active} title={image.title}
                               folderId={image.folderId} imageId={image.dbId} mimeType={image.mimeType}
                               labelFileId={image.labelFileId} currentFolder={this.props.currentFolder}/>
                );
            });
        }
        return (
            <ul className="image-container">
                {rows}
            </ul>
        );
    }
}

// ---------- Container ----------

function getSearchLabels(images, searchTerm){
    return images.filter(image => image.title.match(searchTerm));
}

function mapStateToProps(state) {
    return{
        images: getSearchLabels(state.images, state.searchImages),
        currentFolder: state.currentFolder
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