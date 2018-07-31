import * as React from "react";
import "./search_bar.css";

export default class SearchBarP extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <input className="form-control form-control-lg search-bar" type="text" placeholder="Search" onChange={this.props.onSearch}/>
        );
    }

}