import * as React from "react";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import ViewListIcon from "@material-ui/icons/ViewList";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import SortIcon from "@material-ui/icons/Sort";

export default class ItemToolBar extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <Button value="sort" id="sort" size="small"><SortIcon/></Button>
                <Checkbox icon={<ViewListIcon/>} checkedIcon={<ViewModuleIcon/>} value="checkedH" color="default"/>
                {this.props.children}
            </div>
        );
    }

}