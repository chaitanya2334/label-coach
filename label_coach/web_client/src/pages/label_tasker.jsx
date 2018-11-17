import * as React from "react";
import "../styles/LabelTasker.css";
import {connect} from "react-redux";


import Logo from "../logo";
import SideBarP from "../control/SideBar";
import ImageContainer from "../control/sidebarContainers/ImageContainer";

import ImageViewer from "../Imager/ImageViewer";
import {LabelContainer} from "../control/sidebarContainers/LabelContainer";

import {
    fetchCurrentAssignment,
    fetchImages, resetImages,
} from "../control/controlActions";
import {Link} from "react-router-dom";
import UserControl from "../control/UserControl";
import {withRouter} from "react-router";
import {BrushContainer} from "../control/sidebarContainers/BrushContainer";
import {EraserContainer} from "../control/sidebarContainers/EraserContainer";
import {LabelSelectorContainer} from "../control/sidebarContainers/LabelSelectorContainer";
import {AnnotatorContainer} from "../control/Admin/AnnotatorContainer";
import {isEmpty} from "../utils";
import {fetchAdminData} from "../control/Admin/AdminActions";

class LabelTaskerP extends React.Component {
    constructor(props) {
        super(props);
    }

    setSideBars() {
        let rightBar, leftBar;
        switch (this.props.rightBar) {
            case "labels":
                if (this.props.isAdmin) {
                    rightBar =
                        <SideBarP itemType="Annotators">
                            <AnnotatorContainer/>
                        </SideBarP>
                } else {
                    rightBar =
                        <SideBarP itemType="labels">
                            <LabelContainer/>
                        </SideBarP>;
                }
                break;
            case "brush":
                rightBar =
                    <SideBarP itemType="brush">
                        <BrushContainer/>
                    </SideBarP>;
                break;
            case "eraser":
                rightBar =
                    <SideBarP itemType="eraser">
                        <EraserContainer/>
                    </SideBarP>;
                break;
            case "line":
                rightBar =
                    <SideBarP itemType="line">
                        <LabelSelectorContainer labelType="line"/>
                    </SideBarP>;
                break;
            case "poly":
                rightBar =
                    <SideBarP itemType="poly">
                        <LabelSelectorContainer labelType="poly"/>
                    </SideBarP>;
                break;
            default:
                rightBar = null;
        }
        return {rightBar, leftBar}
    }

    render() {
        document.body.classList.remove('overflow');
        document.body.classList.add('no-overflow');

        if (this.props.currentAssignmentId !== this.props.match.params.id) {
            this.props.fetchImages();
        }
        let {rightBar, leftBar} = this.setSideBars();

        return (
            <div>
                <nav className={"navbar navbar-dark bg-dark navbar-slim"}>
                    <Link to="/content">
                        <div className={"navbar-brand"}>
                            <Logo/>
                        </div>
                    </Link>
                    <UserControl/>
                </nav>
                <div className={"container-fluid"}>
                    <div className={"row"}>
                        <div className={"col-lg-2 hack-sm-2 remove-left-padding"}
                             style={{display: this.props.thumbnailBarVisibility ? 'block' : 'none'}}>
                            <SideBarP itemType="images">
                                <ImageContainer folderId={this.props.match.params.id}/>
                            </SideBarP>
                        </div>
                        <div className={"col-lg-8 hack-grow-8 align-self-top"}>
                            <ImageViewer/>
                        </div>
                        <div className={"col-lg-2 remove-right-padding"} style={{display: rightBar ? 'block' : 'none'}}>
                            {rightBar}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

// ---------- Container ----------

function getId(currentAssignment) {
    if (currentAssignment.hasOwnProperty('image_folder')) {
        return currentAssignment.image_folder._id.$oid
    }
    return ""
}


function mapStateToProps(state) {
    return {
        currentAssignmentId: getId(state.currentAssignment),
        thumbnailBarVisibility: state.thumbnailBarVisibility,
        rightBar: state.rightBar,
        isAdmin: !isEmpty(state.adminData)
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        fetchImages: () => {
            dispatch(fetchCurrentAssignment(ownProps.match.params.id));
            dispatch(fetchAdminData(ownProps.match.params.id));
            dispatch(resetImages());
        }
    };
}

const LabelTasker = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelTaskerP));

export default LabelTasker;
