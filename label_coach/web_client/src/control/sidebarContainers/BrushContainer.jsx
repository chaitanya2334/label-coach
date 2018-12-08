import * as React from "react";
import "../../styles/BrushContainer.css"
import {connect} from "react-redux";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import LabelSelector from "../LabelSelector";
import SizeControl from "../SizeControl";
import {lockAllAnnotations, setDirtyStatus, setOutline} from "../controlActions";


export class BrushContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.labels.length > 0) {
            this.props.labels.forEach((label, i) => {
                rows.push(
                    <LabelSelector key={label.id} id={label.id} type={this.props.labelType} name={label.name} color={label.color}
                                active={label.active} brushes={label.brushes}/>
                );
            });
        }
        return (
            <div className="brush-container">
                <List component="nav"
                      subheader={<ListSubheader component="div">Select Label to Annotate</ListSubheader>}>
                    {rows}
                </List>
                <div className={"flex-end"}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.props.outline}
                                onChange={this.props.setOutline('checkedB')}
                                value="checkedB"
                                color="primary"
                            />
                        }
                        label="Show Outline"
                    />
                    <Divider/>
                    <SizeControl className="flex-center" type="brush"/>
                    <Divider/>
                    <div>
                        <Button variant="contained" onClick={this.props.clear}>
                            Clear
                        </Button>
                        <Button variant="contained" onClick={this.props.save}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}


// ---------- Container ----------

function getSearchLabels(labels, searchTerm) {
    return labels.filter(item => item.name.match(searchTerm));
}

function mapStateToProps(state) {
    return {
        labels: getSearchLabels(state.labels, state.searchLabels),
        outline: state.tools.brush.outline
    }
}

function mapDispatchToProps(dispatch) {
    return {
        save: () => {
            dispatch(lockAllAnnotations("brush"));
            dispatch(setDirtyStatus());
        },

        setOutline: () => (event) => {
            dispatch(setOutline(event.target.checked))
        }
    };
}

export const BrushContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BrushContainerP);