import * as React from "react";
import SaveIndicator from "../SaveIndicator";
import Divider from "@material-ui/core/Divider";
import ToolBar from "../ToolBar";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {setProjectTab} from "./ProjectActions";
import Typography from "@material-ui/core/Typography";

class ProjectViewerP extends React.Component {
    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(event, tabIdx) {
        this.props.setProjectTab(tabIdx);
    }

    render() {
        let {tabIdx} = this.props;
        return (
            <div className={"image-viewer"}>
                <div className={"iv-header"}>
                    <div className={"title"}>Project Title</div>
                </div>
                <div className={"gap1em"}/>
                <Divider/>
                <Paper>
                    <Tabs
                        value={this.props.tabIdx}
                        onChange={this.handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Folders"/>
                        <Tab label="Labels"/>
                        <Tab label="Users"/>
                        <Tab label="General Settings"/>
                    </Tabs>
                </Paper>
                <div className={"gap1em"}/>
                {tabIdx === 0 && <Typography>Item One</Typography>}
                {tabIdx === 1 && <Typography>Item Two</Typography>}
                {tabIdx === 2 && <Typography>Item Three</Typography>}
                {tabIdx === 3 && <Typography>Item Four</Typography>}
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        tabIdx: state.currentProject.tabIdx
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setProjectTab: (tabIdx) => {
            dispatch(setProjectTab(tabIdx));
        }
    };
}

const ProjectViewer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectViewerP));

export default ProjectViewer;