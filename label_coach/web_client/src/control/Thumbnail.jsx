import * as React from "react";
import "../styles/Thumbnail.css";
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createLabelFile, fetchLabels, imageNotReady, selectImage} from "./controlActions";
import "@material/elevation/dist/mdc.elevation.css";
import {fetchAdminLabels} from "./Admin/AdminActions";
import SizeMe from 'react-sizeme';
import {
    cookie,
    getCurrentToken
} from "girder/auth";
import {hideLoading, showLoading} from "react-redux-loading-bar";

class ThumbnailP extends React.Component {
    constructor(props) {
        super(props);
        this.handleHover = this.handleHover.bind(this);
        this.state = {
            isHovered: false
        }
    }

    getThumbnailPath() {
        let girderToken = getCurrentToken() || cookie.find('girderToken');
        if (this.props.mimeType === "image/jpeg" || this.props.mimeType === "image/png") {
            return "api/v1/image/thumbnail/?image_id=" + this.props.imageId + "&w=" + 208;
        } else {
            return "api/v1/image/dzi/" + this.props.imageId + "_files/10/0_0.jpeg";
        }
    }

    handleHover() {
        this.setState({
                          isHovered: !this.state.isHovered
                      });
    }

    render() {
        const { width, height } = this.props.size;

        let thumbnailPath = this.getThumbnailPath();
        let activeClass = this.props.active ? 'active' : "";
        let hoverClass = this.state.isHovered ? "mdc-elevation--z4" : "mdc-elevation--z1";
        let widthClass = this.props.fixedWidth ? "fixed-width" : "";
        return (
            <li className={"tn-card " + hoverClass + " " + widthClass + " mdc-elevation-transition " + activeClass}
                onClick={this.props.onSelect}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleHover}>
                <div className="l-img-thumbnail">
                    <img src={thumbnailPath}/>
                </div>
                <div className={"tn-container"}>
                    <div className={"tn-text"}>
                        <p className={"tn-title line-clamp"}>
                            {this.props.title}
                        </p>
                        <div className={"tn-subtitle"}>
                            Last Edited 28th Aug 2018
                        </div>
                    </div>
                    <div className={"tn-stats"}>
                        <img className={"tn-icon"} src={"https://image.flaticon.com/icons/svg/8/8784.svg"} width={20}
                             height={20}/>
                        {4}
                    </div>
                </div>
            </li>
        );
    }

}

// ---------- Container ----------

function mapStateToProps(state) {

    return {
        girderToken: state.girderToken
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onSelect: (event) => {
            dispatch(showLoading());
            dispatch(imageNotReady());
            dispatch(selectImage(ownProps.id));
            if (ownProps.isAdmin) {
                for (let label_folder of ownProps.currentAssignment.label_folders) {
                    dispatch(
                        fetchAdminLabels(ownProps.title + ".json", label_folder['parentId'], label_folder._id.$oid))
                }
            } else {
                if (ownProps.labelFileId) {
                    dispatch(fetchLabels(ownProps.labelFileId));
                } else {
                    dispatch(createLabelFile(ownProps.title + ".json", ownProps.labelFolderId, ownProps.id));
                }
            }
        },
    }
}

const Thumbnail = compose(
    SizeMe(),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ThumbnailP);

export default Thumbnail;