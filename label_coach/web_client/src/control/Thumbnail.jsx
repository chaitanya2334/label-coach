import * as React from "react";
import "../styles/Thumbnail.css";
import connect from "react-redux/es/connect/connect";
import {createLabelFile, fetchLabels, selectImage} from "./controlActions";

class ThumbnailP extends React.Component {
    constructor(props) {
        super(props);

    }

    getThumbnailPath() {
        return this.props.resPath;
    }

    render() {
        let thumbnailPath = this.getThumbnailPath();
        let activeClass = this.props.active ? 'active': "";
        return (
            <li className={"tn-card " + activeClass} onClick={this.props.onSelect}>
                <div className="l-img-thumbnail">
                    <img src={thumbnailPath}/>
                </div>
                <div className={"tn-text"}>
                    <div className={"tn-title"}>
                        {this.props.title}
                    </div>
                    <div className={"tn-subtitle"}>
                        4 labels
                    </div>
                </div>
            </li>
        );
    }

}

// ---------- Container ----------

function mapStateToProps(state, ownProps) {

   return state;
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onSelect: (event) => {

            dispatch(selectImage(ownProps.id));
            if(ownProps.labelFileId) {
                dispatch(fetchLabels(ownProps.labelFileId));
            }else{
                dispatch(createLabelFile(ownProps.title + ".json", ownProps.id));
            }
        },
    }
}

const Thumbnail = connect(
    mapStateToProps,
    mapDispatchToProps
)(ThumbnailP);

export default Thumbnail;