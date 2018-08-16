import * as React from "react";
import ImageViewer from "./Imager/image_viewer/container";
import "./label_tasker.css";
import ToolBar from "./control/toolbar/container"
import labels from "./dummy_data.json";
import ImgListCard from "./control/imglist_card/container";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./root_reducer";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faRobot} from '@fortawesome/free-solid-svg-icons'


import SideBarP from "./control/sidebar/presenter";
import ImageContainer from "./control/image_container/container";
import LabelContainer from "./control/label_container/container";
import SideBar from "./control/sidebar2/container";
import Logo from "./logo";

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
                        <div className="col-lg-2">
                            <ImgListCard/>
                        </div>
                        <div className="col-lg-8">

                            <ToolBar/>

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
