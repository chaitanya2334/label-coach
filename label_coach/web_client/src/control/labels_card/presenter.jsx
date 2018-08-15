import * as React from "react";
import Label from "../label/container";
import labels_json from "../../dummy_data.json";



export default class LabelsCardP extends React.Component {
    constructor(props) {
        super(props);
        console.log(labels_json['labels'])

    }

    render() {
    let rows = [];
        if (labels_json['labels'].length > 0) {
            labels_json['labels'].forEach((label, i) => {
                rows.push(
                        <Label key={label.id} id={label.id} text={label.text} color={label.color} active={label.active} button={label.button} polygonList={label.polygon_list}/>

                );
            });
        }


        return (
            <div className="card">
    <div className="card-header">
        <a data-toggle="collapse" href="#labels-block" aria-expanded="true" aria-controls="labels-block">
            Labels
        </a>
    </div>
    <div id="labels-block" className="collapse in show">
        <div className="card-block">
         <ul className={"list-group"}>
            {rows}
         </ul>
        </div>
    </div>
</div>
        );
    }

}