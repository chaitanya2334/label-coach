import * as React from "react";
import "../styles/SideBar.css";
import PrevButton from "./PrevButton";
import NextButton from "./NextButton";
import SearchBar from "./SearchBar";

export default class SideBarP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (

            <div className={"sidebar"}>
                <SearchBar id={this.props.itemType}/>
                {this.props.children}
            </div>
        )
    }
}
