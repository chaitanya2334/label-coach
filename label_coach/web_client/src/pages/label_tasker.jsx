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

export default class LabelTasker extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore(rootReducer, applyMiddleware(thunk));
        const unsubscribe = this.store.subscribe(() =>
                                                     console.log(this.store.getState())
        );

        const serverUpdate = this.store.subscribe(()=>{
            let state = this.store.getState();
            this.store.dispatch(postLabels(state));
        });
        this.store.dispatch(fetchImages());
    }

    render() {
        return (
            <Provider store={this.store}>
                <div className={"container-fluid remove-left-padding remove-right-padding"}>
                    <nav className={"navbar sticky-top navbar-light bg-light remove-left-padding"}>
                        <a className={"navbar-brand"}>
                            <Logo/>
                        </a>
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
            </Provider>
        );
    }
}
