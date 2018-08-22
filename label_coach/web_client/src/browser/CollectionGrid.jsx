import React from "react";
import _ from "lodash";
import RGL, {WidthProvider} from "react-grid-layout";
import {connect} from "react-redux";
import Thumbnail from "../control/Thumbnail";
import "../styles/CollectionGrid.css"
import Collection from "./Collection";

const ReactGridLayout = WidthProvider(RGL);

class CollectionGridP extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    generateDOM() {
        let rows = [];
        if (this.props.images.length > 0) {
            this.props.images.forEach((image, i) => {
                rows.push(
                    <Collection key={image.id} id={image.id} active={image.active} title={image.title}
                               resPath={image.getThumbnail} labelFileId={image.labelFileId} fixedWidth={true}/>
                );
            });
        }
        return rows;
    }

    render() {
        return (
            <ReactGridLayout className="layout"
                {...this.props}
            >
                {this.generateDOM()}
            </ReactGridLayout>
        );
    }
}

// ---------- Container ----------

function getSearchLabels(images, searchTerm) {
    return images.filter(image => image.title.match(searchTerm));
}

function mapStateToProps(state) {
    return {
        images: getSearchLabels(state.images, state.searchImages)
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}


const CollectionGrid = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionGridP);

export default CollectionGrid;