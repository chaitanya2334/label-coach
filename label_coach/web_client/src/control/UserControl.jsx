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
        if (this.props.user === undefined) {
            this.props.fetchCurrentUser();
        } else {
            username = this.props.user.login;
        }
        return (
            <div className="dropdown show">
                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <FontAwesomeIcon icon={faUser}/>
                    {username}
                </a>

                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                    <a className="dropdown-item" href="#">Settings</a>
                    <a className="dropdown-item" href="#">Another action</a>
                    <div className="dropdown-divider"/>
                    <a className="dropdown-item" href="#">Logout</a>
                </div>
            </div>


        );
    }

}

// ---------- Container ----------

function mapStateToProps(state) {
    return {
        user: state.authentication.user
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        fetchCurrentUser: () => {
            dispatch(getLoggedUser(ownProps.history))
        }
    };
}

const UserControl = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UserControlP));

export default UserControl;