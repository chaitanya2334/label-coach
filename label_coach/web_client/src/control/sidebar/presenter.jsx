import * as React from "react";
import NavigatorCard from "../navigator_card/container";
import LabelsCard from "../labels_card/container";
import PrevButton from "../prev_button/prev_button";
import NextButton from "../next_button/next_button";
import "./sidebar.css";
import Logo from "../../logo";
import Label from "../label/container";

export default class SideBarP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.labels.length > 0) {
            this.props.labels.forEach((label, i) => {
                rows.push(
                    <li className={"label-item"}>
                        <Label key={label.id} id={label.id} text={label.text} color={label.color} active={label.active}
                               lineButtonState={label.line_button} polyButtonState={label.poly_button}
                               polygons={label.polygons} lines={label.lines}/>
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
