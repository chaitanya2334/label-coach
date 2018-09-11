import React from "react";
import _ from "lodash";
import RGL, {WidthProvider} from "react-grid-layout";
import {connect} from "react-redux";
import Thumbnail from "../control/Thumbnail";
import "../styles/CollectionGrid.css"
import Collection from "./Collection";
import {findCollection} from "./browserActions";

const ReactGridLayout = WidthProvider(RGL);

class CollectionGridP extends React.PureComponent {

    constructor(props) {
        super(props);
        this.props.findCollection();
    }

    generateDOM() {
        let rows = [];
        if (this.props.folders.length > 0) {
            this.props.folders.forEach((collection, i) => {
                rows.push(
                    <Collection key={collection.id} objId={collection.objId} title={collection.name} fixedWidth={true}/>
                );
            });
        }
        return rows;
    }

    render() {
        return (
            <ReactGridLayout className="layout" autoSize={true}
                             {...this.props}
            >
                {this.generateDOM()}
            </ReactGridLayout>
        );
    }
}

// ---------- Container ----------

function getSearchLabels(folders, searchTerm) {
    return folders.filter(folder => folder.name.match(searchTerm));
}

function mapStateToProps(state) {
    return {
        id: state,
        folders: getSearchLabels(state.folders, state.searchFolders)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        findCollection: (id) => {
            dispatch(findCollection(id))
        }
    };
}


const CollectionGrid = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionGridP);

export default CollectionGrid;