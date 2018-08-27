import * as React from "react";
import "../styles/LabelTasker.css";
import {Provider} from "react-redux";
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

export default class LabelTasker extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore(rootReducer, applyMiddleware(thunk));
        const unsubscribe = this.store.subscribe(() =>
                                                     console.log(this.store.getState())
        );
        this.store.dispatch(fetchImages());
        this.actors = [postLabels,];
        this.acting = false;
        this.store.subscribe(() => {
            // Ensure that any action dispatched by actors do not result in a new
            // actor run, allowing actors to dispatch with impunity.
            if (!this.acting) {
                this.acting = true;
                this.actors.forEach((actor, index) => {
                    console.log(actor, index);
                    this.store.dispatch(actor(this.store.getState()))
                });
                this.acting = false
            }
        })
    }

    render() {
        return (
            <Provider store={this.store}>
                <div className={"container-fluid"}>
                        <nav className={"navbar row sticky-top navbar-dark bg-dark navbar-slim"}>
                                <Link to="/content" component={CollectionBrowserP}>
                                    <div className={"navbar-brand"}>
                                        <Logo/>
                                    </div>
                                </Link>
                                <ul className={"navbar-nav"}>
                                    <li className={"nav-item active"}>
                                        <a className={"nav-link"} href={"#"}>
                                            <FontAwesomeIcon icon={faUser}/>
                                            aaljuhani
                                        </a>
                                    </li>
                                </ul>
                        </nav>
                    <div className={"row"}>
                        <div className={"col-lg-2 hack-sm-2 "}>
                                <SideBarP itemType="images">
                                    <ImageContainer/>
                                </SideBarP>
                            </div>
                            <div className={"col-lg-8 hack-grow-8 align-self-top"}>
                                <ToolBar/>
                                <ImageViewer/>
                            </div>
                            <div className={"col-lg-2 "}>
                                <SideBarP itemType="labels">
                                    <LabelContainer/>
                                </SideBarP>
                            </div>
                        </div>
                </div>
            </Provider>
        );
    }
}
