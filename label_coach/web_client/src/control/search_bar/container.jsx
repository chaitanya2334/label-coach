import SearchBarP from "./presenter";
import {addSearchEntry} from "./actions";
import {connect} from "react-redux";

function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onSearch: (event) => dispatch(addSearchEntry(event.target.value, ownProps.id)),
    }
}

const SearchBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchBarP);

export default SearchBar;