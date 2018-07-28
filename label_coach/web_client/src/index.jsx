import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LabelTasker from "./label_tasker";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function main() {
    ReactDOM.render(<LabelTasker/>, document.getElementById('root'));

}
