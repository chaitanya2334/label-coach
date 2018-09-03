import * as React from "react";
import "../styles/Thumbnail.css";
import connect from "react-redux/es/connect/connect";
import {createLabelFile, fetchLabels, selectImage} from "./controlActions";
import "@material/elevation/dist/mdc.elevation.css";

class ThumbnailP extends React.Component {
    constructor(props) {
        super(props);
        this.handleHover = this.handleHover.bind(this);
        this.state={
            isHovered: false
        }
    }

    getThumbnailPath() {
        return "api/v1/image/dzi/" + this.props.imageId + "_files/8/0_0.jpeg";
    }

    handleHover() {
        this.setState({
                          isHovered: !this.state.isHovered
                      });
    }

    render() {
        let thumbnailPath = this.getThumbnailPath();
        let activeClass = this.props.active ? 'active' : "";
        let hoverClass = this.state.isHovered ? "mdc-elevation--z3" : "mdc-elevation--z0";
        let widthClass = this.props.fixedWidth ? "fixed-width": "";
        return (
            <li className={"tn-card " + hoverClass + " " + widthClass + " mdc-elevation-transition " + activeClass}
                onClick={this.props.onSelect}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleHover}>
                <div className="l-img-thumbnail">
                    <img src={thumbnailPath}/>
                </div>
                <div className={"tn-text"}>
                    <p className={"tn-title"}>
                        {this.props.title}
                    </p>
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

const Thumbnail = connect(
    mapStateToProps,
    mapDispatchToProps
)(ThumbnailP);

export default Thumbnail;