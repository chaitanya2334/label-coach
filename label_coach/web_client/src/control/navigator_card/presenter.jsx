import * as React from "react";
import "./style.css";

export default class NavigatorCardP extends React.Component {
    constructor(props) {
        super(props);

    }

    onClick() {

    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <a data-toggle="collapse" aria-expanded="true" aria-controls="navigator-block">
                        Navigator
                    </a>
                </div>

                <div className="navigator-wrapper c-shadow">
                    <div id="navigator"/>
                </div>

            </div>
        );
    }

}