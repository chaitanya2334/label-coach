import ImageViewerP from "./presenter";
import {connect} from "react-redux";
import {lockPolygon, updatePolygon} from "../../control/polygon_item/actions";

function mapStateToProps(state) {
    let polygons = [];
    for (let label of state.labels) {
        let newPolygons = label.polygon_list.map((poly) => {
            let newPoly = Object.assign({}, poly);
            newPoly.label_id = label.id;
            newPoly.poly_id = poly.id;
            return newPoly;
        });
        polygons = polygons.concat(newPolygons);
    }
    return {
        polygons: polygons
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePolygon: (label_id, poly_id, points) => {
            dispatch(updatePolygon(label_id, poly_id, points));
        },
        lockPolygon: (label_id, poly_id) => {
            dispatch(lockPolygon(label_id, poly_id));
        }
    };
}

const ImageViewer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ImageViewerP);

export default ImageViewer;