import * as React from "react";
import SearchBar from "./search_bar";
import PrevButton from "./prev_button";
import NextButton from "./next_button";
import Label from "./label";

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
        if(this.state.labels.length > 0) {
            this.state.labels.forEach((label, i) => {
                rows.push(<Label key={i} index={i} text={label.text} count={0} anns={label.anns}/>);
            });
        }

        return (

            <div className={"sidebar"}>
                <SearchBar/>
                {rows}
                <div className={"container"}>
                    <div className={"row"}>
                        <div className={"col-sm"}>
                            <PrevButton/>
                        </div>
                        <div className={"col-sm"}>
                            <NextButton/>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
