import * as React from "react";
import "../../styles/ImageContainer.css"
import {connect} from "react-redux";
import Thumbnail from "../Thumbnail";


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
                               labelFileId={image.labelFileId} labelFolderId={this.props.labelFolderId}/>
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

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function getSearchLabels(images, searchTerm) {
    return images.filter(image => image.title.match(escapeRegExp(searchTerm)));
}

function getLabelFolderId(currentAssignment) {
    if (currentAssignment.hasOwnProperty('label_folders') && currentAssignment.label_folders.length > 0){
        return currentAssignment.label_folders[0]._id.$oid;
    }
}

function mapStateToProps(state) {
    return {
        images: getSearchLabels(state.images, state.searchImages),
        labelFolderId: getLabelFolderId(state.currentAssignment),
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