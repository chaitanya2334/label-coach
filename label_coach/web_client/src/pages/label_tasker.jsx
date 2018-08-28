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
import {fetchImages, fetchLabels, postLabels} from "../control/controlActions";
import {Link} from "react-router-dom";
import CollectionBrowserP from "./collection_browser";
import UserControl from "../control/UserControl";
import {withRouter} from "react-router";

class LabelTaskerP extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.images.length === 0){
            this.props.fetchImages();
        }
        return (
            <div className={"container-fluid remove-left-padding remove-right-padding"}>
                <nav className={"navbar sticky-top navbar-light bg-light remove-left-padding"}>
                    <Link to="/content">
                        <div className={"navbar-brand"}>
                            <Logo/>
                        </div>
                    </Link>
                    <UserControl/>
                </nav>

                <div className={"row"}>
                    <div className={"col-lg-2 hack-sm-2 remove-left-padding"}>
                        <SideBarP itemType="images">
                            <ImageContainer/>
                        </SideBarP>
                    </div>
                    <div className={"col-lg-8 hack-grow-8 align-self-top"}>
                        <ToolBar/>
                        <ImageViewer/>
                    </div>
                    <div className={"col-lg-2 remove-right-padding"}>
                        <SideBarP itemType="labels">
                            <LabelContainer/>
                        </SideBarP>
                    </div>
                </div>
            </div>

        );
    }
}

// ---------- Container ----------

function mapStateToProps(state){
    return {
        images: state.images
    };
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        fetchImages: ()=>{dispatch(fetchImages(ownProps.match.params.id))}
    };
}

const LabelTasker = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelTaskerP));

export default LabelTasker;
