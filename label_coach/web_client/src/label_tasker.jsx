import * as React from "react";
import ImageViewer from "./Imager/image_viewer/container";
import "./label_tasker.css";
import SideBar from "./control/sidebar/container"
import ToolBar from "./control/toolbar/container"
import labels from "./dummy_data.json";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./root_reducer";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faRobot} from '@fortawesome/free-solid-svg-icons'



export default class LabelTasker extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore(rootReducer, labels);
        const unsubscribe = this.store.subscribe(() =>
                         console.log(this.store.getState())
        );

    }



    render() {
        return (
            <Provider store={this.store}>
            <div className={"container-fluid"}>

            <nav className={"navbar sticky-top navbar-light bg-light"}>
                <a className={"navbar-brand"}>
                <FontAwesomeIcon icon={faRobot}/>
                Label Coach
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
                <div className="col-lg-1">
                        <ToolBar/>
                 </div>
                 <div className="col-lg-9">
                        <ImageViewer/>
                 </div>
                    <div className={"col-lg-2"}>
                        <SideBar/>
                    </div>
                </div>
            </div>
        </Provider>
        );
    }
}
