import * as React from "react";
import "../styles/LabelTasker.css";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import rootReducer from "../root_reducer";

import Logo from "../logo";
import UserControl from "../control/UserControl";


import thunk from "redux-thunk";
import LoginForm from "../login/LoginForm"

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
                <div className="row" id="login_container">
                    <LoginForm/>
                </div>
        );
    }
}
