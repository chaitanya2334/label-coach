import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {connect} from "react-redux";

class UserControlP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <ul className={"navbar-nav"}>
                <li className={"nav-item active"}>
                    <a className={"nav-link"} href={"#"}>
                        <FontAwesomeIcon icon={faUser}/>
                        {this.props.user.login}
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

function mapDispatchToProps(dispatch){
    return {};
}

const UserControl = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserControlP);

export default UserControl;