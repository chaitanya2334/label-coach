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

export default class CollectionBrowserP extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore(rootReducer, applyMiddleware(thunk));
    }

    render() {
        return (
            <Provider store={this.store}>
                <div className={"container-fluid remove-left-padding remove-right-padding"}>
                    <nav className={"navbar sticky-top navbar-light bg-light remove-left-padding"}>
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
                        <div className={"col-lg-8 hack-grow-8 align-self-top"}>
                            <CollectionGrid className={"layout"} isDraggable={false} isResizable={false} items={50}
                                            rowHeight={48}/>
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }
}