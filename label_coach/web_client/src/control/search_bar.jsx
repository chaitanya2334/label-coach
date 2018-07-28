import * as React from "react";

export default class SearchBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            entry: ""
        }
    }

    render() {
        return (
            <input className="form-control form-control-lg" type="text" placeholder="Search"/>
        );
    }

}