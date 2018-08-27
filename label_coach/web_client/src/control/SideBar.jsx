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

            <div className={"sidebar row"}>
                <ul className={"sidebar-header"}>
                    <li className={"marginTop"}>
                        <SearchBar id={this.props.itemType}/>
                    </li>
                </ul>

               
            </div>
        )
    }
}
