import * as React from "react";
import "./search_bar.css";

export default class SearchBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            entry: ""
        }
    }

    render() {
        return (
            <input className="form-control form-control-lg search-bar" type="text" placeholder="Search"/>
        );
    }

}