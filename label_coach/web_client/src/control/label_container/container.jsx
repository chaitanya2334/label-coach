
import {connect} from "react-redux";
import LabelContainerP from "./presenter";

function getSearchLabels(labels, searchTerm){
    return labels.filter(item => item.text.match(searchTerm));
}

function mapStateToProps(state) {
    return{
        labels: getSearchLabels(state.labels, state.searchLabels)
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

const LabelContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelContainerP);

export default LabelContainer;