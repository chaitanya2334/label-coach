import * as React from "react";
import {Link} from "react-router-dom";
import Logo from "../logo";
import UserControl from "../control/UserControl";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router";
import SideBarP from "../control/SideBar";
import ProjectContainer from "../control/Project/ProjectContainer";
import ProjectViewer from "../control/Project/ProjectViewer";

class AdminPageP extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <nav className={"navbar navbar-dark bg-dark navbar-slim"}>
                    <Link to="/content">
                        <div className={"navbar-brand"}>
                            <Logo/>
                        </div>
                    </Link>
                    <UserControl/>
                </nav>
                <div className={"container-fluid"}>
                    <div className={"row"}>
                        <div className={"col-lg-2 hack-sm-2 remove-left-padding"}>
                            <SideBarP itemType="images">
                                <ProjectContainer/>
                            </SideBarP>
                        </div>
                        <div className={"col-lg-8 hack-grow-8 align-self-top"}>
                            <ProjectViewer/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch){
    return {};
}

const AdminPage = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminPageP));

export default AdminPage;