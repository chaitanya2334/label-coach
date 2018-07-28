import * as React from "react";

export default class PrevButton extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <button type="button" className="btn btn-primary">Back</button>
        )
    }

}