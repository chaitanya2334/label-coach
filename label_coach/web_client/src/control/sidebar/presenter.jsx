import * as React from "react";
import NavigatorCard from "../navigator_card/container";
import LabelsCard from "../labels_card/container";
import PrevButton from "../prev_button/prev_button";
import NextButton from "../next_button/next_button";
import "./style.css";
import Logo from "../../logo";
import Label from "../label/container";

export default class SideBarP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (

            <div className={"sidebar"}>
                <ul className={"sidebar-header"}>
                    <li>
                        <Logo/>
                    </li>
                    <li>
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
