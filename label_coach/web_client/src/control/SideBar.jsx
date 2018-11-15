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
    console.log(this.props);
        let content;
        switch (this.props.itemType) {
            case "images":
                content = <SearchBar id={this.props.itemType}/>;
                break;
            case "annotators":
                content = <div className={"p-3 mb-2 bg-secondary text-white"}>Annotators Overview</div>;
                break;
            case "labels":
                content = <div className={"p-3 mb-2 bg-secondary text-white"}>Labels Overview</div>;
                break;
            case "brush":
                content = <div className={"p-3 mb-2 bg-secondary text-white"}>Brush Tool</div>;
                break;
            case "eraser":
                content = <div className={"p-3 mb-2 bg-secondary text-white"}>Eraser Tool</div>;
                break;
            case "line":
                content = <div className={"p-3 mb-2 bg-secondary text-white"}>Line Tool</div>;
                break;
            case "poly":
                content = <div className={"p-3 mb-2 bg-secondary text-white"}>Polygon Tool</div>;
                break;
            default:
                content = null;
        }

        return (

            <div className={"sidebar"}>
                {content}
                {this.props.children}
            </div>
        )
    }
}
