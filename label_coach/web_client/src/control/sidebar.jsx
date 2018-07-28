import * as React from "react";
import SearchBar from "./search_bar";
import PrevButton from "./prev_button";
import NextButton from "./next_button";
import Label from "./label";
import "./sidebar.css";
import Logo from "../logo";

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeLabel: null,
            labels: this.props.labels,

        }

    }

    render() {
        let rows = [];
        if (this.state.labels.length > 0) {
            this.state.labels.forEach((label, i) => {
                rows.push(
                    <li className={"label-item"}>
                        <Label key={i} index={i} text={label.text} count={0} anns={label.anns}/>
                    </li>
                );
            });
        }

        return (

            <div className={"sidebar"}>
                <ul className={"sidebar-container"}>
                    <li>
                        <Logo/>
                    </li>
                    <li>
                        <SearchBar/>
                    </li>
                </ul>
                <ul className={"sidebar-container"}>
                    {rows}
                    <li className={"button-group"}>
                        <div className={"container-fluid"}>
                            <div className={"row justify-content-between"}>
                                <div className={"col-sm-3"}>
                                    <PrevButton/>
                                </div>
                                <div className={"col-sm-3"}>
                                    <NextButton/>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>


            </div>
        )
    }
}
