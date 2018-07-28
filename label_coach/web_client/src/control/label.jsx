import * as React from "react";
import SideVertBar from "./side_vert_bar";
import Counter from "./counter";
import Annotations from "./annotations";

export default class Label extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index,
            text: this.props.text,
            count: this.props.count, // the total number of annotations collected so far for this label
            anns: this.props.anns
        }
    }

    render(){
        let colorClass = 'color' + this.state.index;
        return (
            <div className={"label"}>
                <SideVertBar key={"svb_" + this.state.index} colorid={colorClass}/>
                <h3>{this.state.text}</h3>
                <Counter key={"c_" + this.state.index} count={this.state.count}/>
                <Annotations key={"ann_" + this.state.index} anns={this.state.anns}/>
            </div>
        )
    }
}