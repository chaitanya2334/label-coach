import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LabelTasker from "./pages/label_tasker";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./pages/login";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import CollectionBrowserP from "./pages/collection_browser";
import RegisterPage from "./pages/register";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import rootReducer from "./root_reducer";
import thunk from "redux-thunk";
import {fetchImages, postLabels} from "./control/controlActions";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore(rootReducer, applyMiddleware(thunk));
        const unsubscribe = this.store.subscribe(() =>
                                                     console.log(this.store.getState())
        );
        this.actors = [postLabels,];
        this.acting = false;
        this.store.subscribe(() => {
            // Ensure that any action dispatched by actors do not result in a new
            // actor run, allowing actors to dispatch with impunity.
            if (!this.acting) {
                this.acting = true;
                this.actors.forEach((actor, index) => {
                    console.log(actor, index);
                    this.store.dispatch(actor(this.store.getState()))
                });
                this.acting = false
            }
        })
    }

    render() {
        return (
            <Provider store={this.store}>
                <Router>
                    <div>
                        <Route exact path="/" component={LoginPage}/>
                        <Route exact path="/register" component={RegisterPage}/>
                        <Route exact path="/tasker" component={LabelTasker}/>
                        <Route exact path="/content" component={CollectionBrowserP}/>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default function main() {
    ReactDOM.render(<Index/>, document.getElementById('root'));
}
