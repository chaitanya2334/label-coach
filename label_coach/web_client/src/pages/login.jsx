import * as React from "react";
import "../styles/LabelTasker.css";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import rootReducer from "../root_reducer";

import thunk from "redux-thunk";
import LoginForm from "../login/LoginForm"

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
                <div className="jumbotron">
                    <LoginForm/>
                </div>
        );
    }
}