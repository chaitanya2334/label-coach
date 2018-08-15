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

            <li className={"list-group-item " + this.props.color + " " + activeClass}>
           {this.props.text}
           <div className="row">
            <span class="badge badge-secondary float-right badge-pill"> <Counter key={"c_" + this.props.id} count={count}/></span>
            <PolygonList key={"ann_" + this.props.id} label_id={this.props.id} polygonList={this.props.polygonList}
                          color={this.props.id} active={this.props.active}/>
                          <CreateButton active={this.props.active} label={this.props} text={this.props.button}/>
                          </div>
             </li>

        )
    }
}

