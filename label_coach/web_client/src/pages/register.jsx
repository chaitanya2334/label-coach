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
        this.store = createStore(rootReducer, applyMiddleware(thunk));
        const unsubscribe = this.store.subscribe(() =>
                                                     console.log(this.store.getState())
        );
    }

    render() {
        return (
            <Provider store={this.store}>
                <div className="jumbotron">
                    <RegisterForm/>
                </div>
            </Provider>
        );
    }
}
