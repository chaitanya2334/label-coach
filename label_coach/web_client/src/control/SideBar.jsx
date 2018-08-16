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
                <ul className={"sidebar-header"}>
                    <li className={"marginTop"}>
                        <SearchBar id={this.props.itemType}/>
                    </li>
                </ul>

                {this.props.children}

                <ul className={"sidebar-footer"}>
                    <li className={"button-group"}>
                        <div className={"container-fluid"}>
                            <div className={"row justify-content-between"}>
                                <div className={"col-sm-3"}>
                                    <PrevButton key={"prev"}/>
                                </div>
                                <div className={"col-sm-3"}>
                                    <NextButton key={"next"}/>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}
