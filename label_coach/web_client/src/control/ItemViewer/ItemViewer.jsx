import * as React from "react";
import ItemToolBar from "./ItemToolBar";

export default class ItemViewer extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <ItemToolBar/>
                {this.props.children}
            </div>
        );
    }

}