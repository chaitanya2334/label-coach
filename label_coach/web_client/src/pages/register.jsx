import * as React from "react";
import "../styles/LabelTasker.css";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import rootReducer from "../root_reducer";

import thunk from "redux-thunk";
import RegisterForm from "../login/RegisterForm";

export default class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

                <div className="jumbotron">
                    <RegisterForm/>
                </div>

        );
    }
}
