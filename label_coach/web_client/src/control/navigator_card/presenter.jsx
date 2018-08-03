import * as React from "react";

export default class NavigatorCardP extends React.Component {
    constructor(props) {
        super(props);

    }

onClick(){

    }

    render() {
        return (
            <div className="card">
    <div className="card-header">
        <a data-toggle="collapse" href="#navigator-block" aria-expanded="true" aria-controls="navigator-block">
            Navigator
        </a>
    </div>
    <div id="navigator-block" className="collapse in show">
        <div className="card-block">
            card block
        </div>
    </div>
</div>
        );
    }

}