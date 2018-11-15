import * as React from "react";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router";

class ProjectContainerP extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>

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

const ProjectContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectContainerP));

export default ProjectContainer;