import * as React from "react";
import {Link} from "react-router-dom";
import Logo from "../logo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import Provider from "react-redux/es/components/Provider";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import rootReducer from "../root_reducer"
import CollectionGrid from "../browser/CollectionGrid";
import {fetchImages} from "../control/controlActions";
import UserControl from "../control/UserControl";

export default class CollectionBrowserP extends React.Component {
    constructor(props) {
        super(props);
        // make sure the user is logged in

    }

    render() {
        return (
            <div className={"container-fluid remove-left-padding remove-right-padding"}>
                <nav className={"navbar navbar-dark bg-dark navbar-slim"}>
                    <Link to="/content">
                        <div className={"navbar-brand"}>
                            <Logo/>
                        </div>
                    </Link>
                    <UserControl/>
                </nav>

                <div className={"row justify-content-center"}>
                    <div className={"col-lg-8 align-self-top"}>
                        <CollectionGrid className={"layout"} isDraggable={false} isResizable={false}/>
                    </div>
                </div>
            </div>
        );
    }
}
