import * as React from "react";
import {Link} from "react-router-dom";
import Logo from "../logo";
import AssignmentGrid from "../browser/AssignmentGrid";
import UserControl from "../control/UserControl";
import {isEmpty} from "../utils";
import {fetchCurrentAssignment, resetImages} from "../control/controlActions";
import {withRouter} from "react-router";
import {connect} from "react-redux";

export default class CollectionBrowserP extends React.Component {
    constructor(props) {
        super(props);
        // make sure the user is logged in

    }

    render() {
        document.body.classList.remove('no-overflow');
        document.body.classList.add('overflow');

        if (this.props.areImagesDangling){
            // if there are images still present in the state from the previous collection, then reset.
            this.resetImages();
        }
        return (

             <div className={"container-fluid"}>
                <nav className={"navbar row sticky-top navbar-dark bg-dark navbar-slim"}>

                    <Link to="/content">
                        <div className={"navbar-brand"}>
                            <Logo/>
                        </div>
                    </Link>
                    <UserControl/>
                </nav>

                <div className={"row"}>
                    <div className={"col-lg-8 offset-lg-2"}>
                        <AssignmentGrid className={"layout"} isDraggable={false} isResizable={false} items={50}/>

                    </div>
                </div>


            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        areImagesDangling: state.images.length > 0
    };
}

function mapDispatchToProps(dispatch) {
    return {
        resetImages: () => {
            dispatch(resetImages());
        }
    };
}

const CollectionBrowser = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionBrowserP));

export default CollectionBrowser;
