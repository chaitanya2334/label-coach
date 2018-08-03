import * as React from "react";

export default class LabelsCardP extends React.Component {
    constructor(props) {
        super(props);

    }

onClick(){

    }

    render() {
        return (
            <div className="card">
    <div className="card-header">
        <a data-toggle="collapse" href="#labels-block" aria-expanded="true" aria-controls="labels-block">
            Labels
        </a>
    </div>
    <div id="labels-block" className="collapse in show">
        <div className="card-block">
            card block
        </div>
    </div>
</div>
        );
    }

}