import SearchBarP from "./presenter";
import {addSearchEntry} from "./actions";
import {connect} from "react-redux";

function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        onSearch: (event) => dispatch(addSearchEntry(event.target.value)),
    }
}

const SearchBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchBarP);

export default SearchBar;