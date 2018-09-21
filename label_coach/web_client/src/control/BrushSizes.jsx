import * as React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import AnnotationListP from "./AnnotationList";
import Counter from "./Counter";
import "../styles/BrushLabel.css"
import {toggleLabel} from "./controlActions";
import BrushLabel from "./BrushLabel";
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';


class BrushSizesP extends React.Component {
    constructor(props) {
        super(props);
         this.state = { value: 10 };
    }


    render() {
    return (
      <InputRange
        formatLabel={value => `${value}px`}
        maxValue={20}
        minValue={0}
        value={this.state.value}
        onChange={value => this.setState({ value })} />
    );
  }
}

// ---------- Container ----------

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onClick: () => {
            dispatch(toggleLabel(ownProps))
        }
    }
}

const BrushSizes = connect(
    mapStateToProps,
    mapDispatchToProps
)(BrushSizesP);

export default BrushSizes;