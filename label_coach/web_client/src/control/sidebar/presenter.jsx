import * as React from "react";
import NavigatorCard from "../navigator_card/container";
import LabelsCard from "../labels_card/container";
import PrevButton from "../prev_button/prev_button";
import NextButton from "../next_button/next_button";
import "./sidebar.css";

export default class SideBarP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {


        return (

            <div className={"sidebar"}>
                <NavigatorCard/>
                <LabelsCard/>
            </div>
        )
    }
}
