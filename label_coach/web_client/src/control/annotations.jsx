import * as React from "react";

export default class Annotations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anns: this.props.anns
        }
    }

    render() {
        let rows = [];
        if (this.state.anns.length > 0) {
            this.state.anns.forEach((ann, i) => {
                rows.push(<Annotation id={"Annotation_" + i}/>);
            });
        }

        return (
            <div className={"annotations"}>
                {rows}
            </div>
        );
    }

}