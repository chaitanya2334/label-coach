import * as React from "react";
import "../styles/LabelTasker.css";
import {connect, Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import rootReducer from "../root_reducer";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faRobot} from '@fortawesome/free-solid-svg-icons'

import Logo from "../logo";
import SideBarP from "../control/SideBar";
import ImageContainer from "../control/ImageContainer";
import ToolBar from "../control/ToolBar";
import ImageViewer from "../Imager/ImageViewer";
import {LabelContainer} from "../control/LabelContainer";
import thunk from "redux-thunk";
import {fetchImages, fetchLabels, postLabels, setCurrentFolder} from "../control/controlActions";
import {Link} from "react-router-dom";
import CollectionBrowserP from "./collection_browser";
import UserControl from "../control/UserControl";
import {withRouter} from "react-router";
import {BrushContainer} from "../control/BrushContainer";

class LabelTaskerP extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.currentFolderId !== this.props.match.params.id) {
            this.props.fetchImages();
        }
        let rightBar, leftBar;
        switch (this.props.rightBar) {
            case "labels":
                rightBar =
                    <SideBarP itemType="labels">
                        <LabelContainer/>
                    </SideBarP>;

                break;
            case "brush":
                rightBar =
                    <SideBarP itemType="brush">
                        <BrushContainer/>
                    </SideBarP>;
                break;
            case "polygon":
                rightBar =
                    <SideBarP itemType="polygon">
                        <LabelSelectorContainer/>
                    </SideBarP>;
                break;
            case "line":
                rightBar =
                    <SideBarP itemType="paintbrush">
                        <LabelSelectorContainer/>
                    </SideBarP>;
                break;
            default:
                rightBar = null;
        }


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
                                <ImageContainer/>
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

function mapStateToProps(state) {
    return {
        images: state.images,
        currentFolderId: state.currentFolder.id,
        thumbnailBarVisibility: state.thumbnailBarVisibility,
        rightBar: state.rightBar
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        fetchImages: () => {
            dispatch(setCurrentFolder(ownProps.match.params.id));
            dispatch(fetchImages(ownProps.match.params.id))
        }
    };
}

const LabelTasker = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelTaskerP));

export default LabelTasker;
