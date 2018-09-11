import * as React from "react";
import "../styles/Tag.css";
import RGL, {WidthProvider} from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

export default class Tags extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let ret = [];
        let w = 5;
        let h = 1;
        let labels = ["Normal", "Benign", "Invasive", "InSitu"];
        for (let i in labels) {
            ret.push(
                <div className="blue tag" key={i} >
                    {labels[i]}
                    <div className={"count"}>
                        {4}
                    </div>
                </div>);
        }
        return (
            <div className={"inline"}>
                {ret}
            </div>


        );
    }

}