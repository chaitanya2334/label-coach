import * as React from "react";
import Counter from "../counter/counter";
import PolygonList from "../polygon_list/polygon_list";
import "./label.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import CreateButton from "../create_button/container";

export default class LabelP extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let faType = this.props.active ? faAngleUp : faAngleDown;
        let activeClass = this.props.active ? "active" : "";

        let count = this.props.polygonList.length;

        return (
            <div >
                <div className={"container-fluid label side-vert-bar " + this.props.color + " " + activeClass}>
                    <div className={"row align-items-center"} >
                        <div className={"col-sm-6 text"} onClick={this.props.onClick}>
                            {this.props.text}
                            <Counter key={"c_" + this.props.index} count={count}/>
                        </div>
                        <div className={"col-sm-4"}>
                            <CreateButton active={this.props.active} label={this.props} text={this.props.button}/>
                        </div>

                        <div className={"col-sm-1"} onClick={this.props.onClick}>
                            <FontAwesomeIcon icon={faType}/>
                        </div>
                    </div>
                </div>
                <PolygonList key={"ann_" + this.props.index} index={"ann_" + this.props.index} polygonList={this.props.polygonList}
                          color={this.props.id} active={this.props.active}/>
            </div>
        )
    }
}

