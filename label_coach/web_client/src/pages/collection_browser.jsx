import * as React from "react";
import {Link} from "react-router-dom";
import Logo from "../logo";
import AssignmentGrid from "../browser/AssignmentGrid";
import UserControl from "../control/UserControl";

export default class CollectionBrowserP extends React.Component {
    constructor(props) {
        super(props);
        // make sure the user is logged in

    }

    render() {
        document.body.classList.remove('no-overflow');
        document.body.classList.add('overflow');
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
