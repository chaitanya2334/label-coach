import SideBarP from "./presenter";
import {connect} from "react-redux";

function getSearchLabels(labels, searchTerm){
    return labels.filter(label => label.text.match(searchTerm));
}

function mapStateToProps(state) {
    return{
        labels: getSearchLabels(state.labels, state.search)
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

const SideBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(SideBarP);

export default SideBar;