import ImageViewerP from "./presenter";
import {connect} from "react-redux";
import {lockAnnotation, updateAnnotation} from "../../control/annotation/actions";

function mapStateToProps(state) {
    let polygons = [];
    let lines = [];
    for (let label of state.labels) {
        let newPolygons = label.polygons.map((poly) => {
            let newPoly = Object.assign({}, poly);
            newPoly.label_id = label.id;
            newPoly.poly_id = poly.id;
            return newPoly;
        });
        let newLines = label.lines.map((line) => {
            let newLine = Object.assign({}, line);
            newLine.label_id = label.id;
            newLine.line_id = line.id;
            return newLine;
        });
        lines = lines.concat(newLines);
        polygons = polygons.concat(newPolygons);
    }
    return {
        polygons: polygons,
        lines: lines
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePolygon: (label_id, poly_id, points) => {
            dispatch(updateAnnotation("polygon", label_id, poly_id, points));
        },
        lockPolygon: (label_id, poly_id) => {
            dispatch(lockAnnotation("polygon", label_id, poly_id));
        },
        updateLine: (label_id, line_id, points) => {
            dispatch(updateAnnotation("line", label_id, line_id, points));
        },
        lockLine: (label_id, line_id) =>{
            dispatch(lockAnnotation("line", label_id, line_id));
        }
    };
}

const ImageViewer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ImageViewerP);

export default ImageViewer;