import * as React from "react";
import "../styles/Collection.css";
import connect from "react-redux/es/connect/connect";
import "@material/elevation/dist/mdc.elevation.css";
import {fetchThumbnails, selectCollection} from "./browserActions";
import {WidthProvider} from "react-grid-layout";
import RGL from "react-grid-layout";
import {withRouter} from "react-router";

const ReactGridLayout = WidthProvider(RGL);

class CollectionP extends React.Component {
    constructor(props) {
        super(props);
        this.handleHover = this.handleHover.bind(this);
        this.state = {
            isHovered: false
        };
        this.props.getThumbnails(4);
        console.log(this.state);
    }

    getThumbnails(n) {
        let ret = [];
        let w = 6;
        let h = 1;

        for (let i = 0; i < n; i++) {
            let path = "";
            if (this.props.thumbnails.length > i) {
                path = "api/v1/image/" + this.props.thumbnails[i].id + "_files/8/0_0.jpeg";
            }
            ret.push(
                <div className="thumbnail-container" key={i} data-grid={{x:w*(i%2), y:h * Math.floor(i/2), w: w, h: h}}>
                    <img className="preview" src={path}/>
                </div>);
        }
        return ret;
    }

    handleHover() {
        this.setState({
                          isHovered: !this.state.isHovered
                      });
    }

    render() {
        let hoverClass = this.state.isHovered ? "mdc-elevation--z2" : "mdc-elevation--z1";
        let widthClass = this.props.fixedWidth ? "fixed-width" : "";

        return (

            <div className="card"
                onClick={this.props.onSelect}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleHover}>

                <ReactGridLayout className="layout" autoSize={true} isDraggable={false} isResizable={false}
                                 rowHeight={50} responsive={false} margin={[2, 2]}>
                    {this.getThumbnails(4)}
                </ReactGridLayout>

                <div className="card-body">
                    <h5 className="card-title text-center">{this.props.title}</h5>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item remove-all-padding text-center">Items: 4</li>
                        <li className="list-group-item remove-all-padding text-center">Annotators: 2</li>
                        <li className="list-group-item remove-all-padding text-center">Labels: 3</li>
                    </ul>
                </div>

            </div>

        );
    }

}

// ---------- Container ----------

function mapStateToProps(state, ownProps) {
    let id = state.folders.findIndex(x => x.objId === ownProps.objId);
    return {
        thumbnails: state.folders[id].thumbnails || []
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onSelect: (event) => {
            dispatch(selectCollection(ownProps.objId, ownProps.history));
        },
        getThumbnails: (count) => {
            dispatch(fetchThumbnails(ownProps.objId, count));
        }
    }
}

const Collection = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionP));

export default Collection;