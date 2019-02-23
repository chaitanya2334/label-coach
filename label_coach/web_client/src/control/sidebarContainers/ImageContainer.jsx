import * as React from "react";
import "../../styles/ImageContainer.css"
import {connect} from "react-redux";
import Thumbnail from "../Thumbnail";
import InfiniteScroll from "../InfiniteScroll";
import {fetchImages, resetImages} from "../controlActions";


class ImageContainerP extends React.Component {
    constructor(props) {
        super(props);
        this.loadMore = this.loadMore.bind(this);
    }

    loadMore(page) {
        this.props.findImages(this.props.folderId, page);
        //this.props.setHasMore(false);
    }

    render() {
        let rows = [];
        if (this.props.images.length > 0) {
            this.props.images.forEach((image, i) => {
                rows.push(
                    <Thumbnail key={i} id={image.id} active={image.active} title={image.title}
                               folderId={image.folderId} imageId={image.dbId} mimeType={image.mimeType}
                               labelFileId={image.labelFileId} labelFolderId={this.props.labelFolderId}
                               currentAssignment={this.props.currentAssignment} isAdmin={this.props.isAdmin}/>
                );
            });
        }
        const loader = <div className="loader" key={"loader-key"}>Loading ...</div>;
        this.hasMore = this.props.hasMore;
        return (
            <ul className="image-container" ref={el => this.parentElement = el}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMore}
                    hasMore={this.hasMore}
                    loader={loader} initialLoad={true} threshold={250}
                    useWindow={false} isReverse={false} useCapture={false} getScrollParent={() => this.parentElement}
                >

                    {rows}

                </InfiniteScroll>
            </ul>
        );
    }
}

// ---------- Container ----------

function isAdmin(currentUser, currentAssignment) {
    if (currentUser !== undefined && currentAssignment.hasOwnProperty('owner')) {
        return currentUser._id === currentAssignment.owner._id.$oid;
    }
    return false;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function getSearchLabels(images, searchTerm) {
    return images.filter(image => image.title.match(escapeRegExp(searchTerm)));
}

function getLabelFolderId(currentAssignment) {
    if (currentAssignment.hasOwnProperty('label_folders') && currentAssignment.label_folders.length > 0) {
        return currentAssignment.label_folders[0]._id.$oid;
    }
}

function getId(currentAssignment) {
    if (currentAssignment.hasOwnProperty('image_folder')) {
        return currentAssignment.image_folder._id.$oid
    }
    return ""
}

function mapStateToProps(state) {
    return {
        images: getSearchLabels(state.images, state.searchImages),
        labelFolderId: getLabelFolderId(state.currentAssignment),
        currentAssignment: state.currentAssignment,
        isAdmin: isAdmin(state.authentication.user, state.currentAssignment),
        hasMore: state.hasMoreImages
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        findImages: (folderId, page) => {
            if (page === 1) {
                dispatch(resetImages());
            }
            dispatch(fetchImages(folderId, 5, page - 1))
        }
    };
}

const ImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageContainerP);

export default ImageContainer;