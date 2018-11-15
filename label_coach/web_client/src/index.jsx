import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LabelTasker from "./pages/label_tasker";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./pages/login";
import {Route, HashRouter} from "react-router-dom";
import CollectionBrowserP from "./pages/collection_browser";
import RegisterPage from "./pages/register";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import rootReducer from "./root_reducer";
import thunk from "redux-thunk";
import {composeWithDevTools} from "remote-redux-devtools";
import AdminPage from "./pages/AdminPage";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
    }

    render() {
        return (
            <Provider store={this.store}>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={LoginPage}/>
                        <Route exact path="/register" component={RegisterPage}/>
                        <Route path="/tasker/:id" component={LabelTasker}/>
                        <Route exact path="/content" component={CollectionBrowserP}/>
                        <Route exact path="/admin/:id" component={AdminPage}/>
                    </div>
                </HashRouter>
            </Provider>
        );
    }
}

export default function main() {
    ReactDOM.render(<Index/>, document.getElementById('root'));
}
