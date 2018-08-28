import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {connect} from "react-redux";
import {getLoggedUser} from "../login/LoginActions";
import {withRouter} from "react-router";

class UserControlP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let username = "no-login";
        if(this.props.user === undefined){
            this.props.fetchCurrentUser();
        }else{
            username = this.props.user.login;
        }
        return (
            <ul className={"navbar-nav"}>
                <li className={"nav-item active"}>
                    <a className={"nav-link"} href={"#"}>
                        <FontAwesomeIcon icon={faUser}/>
                        {username}
                    </a>
                </li>
            </ul>
        );
    }

}

// ---------- Container ----------

function mapStateToProps(state){
    return {
        user: state.authentication.user
    };
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        fetchCurrentUser: ()=>{dispatch(getLoggedUser(ownProps.history))}
    };
}

const UserControl = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UserControlP));

export default UserControl;