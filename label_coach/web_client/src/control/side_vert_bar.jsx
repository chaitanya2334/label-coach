import * as React from "react";

export default class SideVertBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            colorid: this.props.colorid
        }
    }

    render() {
        return (
            <div className={['side-vert-bar' , this.state.colorid].join(' ')}/>
        );
    }

}