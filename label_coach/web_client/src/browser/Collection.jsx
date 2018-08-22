import * as React from "react";
import "../styles/Collection.css";
import connect from "react-redux/es/connect/connect";
import {createLabelFile, fetchLabels, selectImage} from "../control/controlActions";
import "@material/elevation/dist/mdc.elevation.css";

class CollectionP extends React.Component {
    constructor(props) {
        super(props);
        this.handleHover = this.handleHover.bind(this);
        this.state = {
            isHovered: false
        }
    }

    getThumbnailPath() {
        return this.props.resPath;
    }

    handleHover() {
        this.setState({
                          isHovered: !this.state.isHovered
                      });
    }

    render() {
        let thumbnailPath = this.getThumbnailPath();
        let activeClass = this.props.active ? 'active' : "";
        let hoverClass = this.state.isHovered ? "mdc-elevation--z6" : "mdc-elevation--z0";
        let widthClass = this.props.fixedWidth ? "fixed-width" : "";
        return (
            <li className={"tn-card " + hoverClass + " " + widthClass + " mdc-elevation-transition " + activeClass}
                onClick={this.props.onSelect}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleHover}>
                <div className="row remove-all-margin">
                    <div className="col-6 remove-all-padding thumbnail-container">
                        <img className="preview" src={thumbnailPath}/>
                    </div>
                    <div className="col-6 remove-all-padding thumbnail-container">
                        <img className="preview" src={thumbnailPath}/>
                    </div>
                </div>
                <div className="row remove-all-margin">
                    <div className="col-6 remove-all-padding thumbnail-container">
                        <img className="preview" src={thumbnailPath}/>
                    </div>
                    <div className="col-6 remove-all-padding thumbnail-container">
                        <img className="preview" src={thumbnailPath}/>
                    </div>
                </div>
                <div className={"tn-text"}>
                    <div className={"tn-title"}>
                        {this.props.title}
                    </div>
                    <div className={"tn-subtitle"}>
                        4 labels
                    </div>
                </div>
            </li>
        );
    }

}

// ---------- Container ----------

function mapStateToProps(state, ownProps) {

    return state;
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onSelect: (event) => {

            dispatch(selectImage(ownProps.id));
            if (ownProps.labelFileId) {
                dispatch(fetchLabels(ownProps.labelFileId));
            } else {
                dispatch(createLabelFile(ownProps.title + ".json", ownProps.id));
            }
        },
    }
}

const Collection = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionP);

export default Collection;