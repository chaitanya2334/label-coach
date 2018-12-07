import Shape from "./shape"
import OpenSeadragon from "openseadragon";
import "./osdSvgOverlay";
import * as d3 from 'd3';
import Dot from "./dot";

export default class Line extends Shape {
    constructor(overlay, viewer, labelId, lineId, zoom) {
        super(overlay, viewer);
        this.lineId = lineId;
        this.labelId = labelId;
        this.zoom = zoom;
        this.strokeWidth = 0.002;
        this.d3obj = d3.select(this.overlay.node())
                       .append("path")
                       .attr('class', 'transparent')
                       .attr('id', this.lineId)
                       .attr('stroke-width', this.strokeWidth * (1 / this.zoom));
        this.dots = [];
        this.setDrawState("read-only");

    }

    setDrawState(state) {
        this.drawState = state;
    }

    getImagePoints() {
        let points = [];
        for (let dot of this.dots) {
            points.push(dot.getImgPoint());
        }
        return points;
    }

    addImagePoints(points) {
        for (let point of points) {
            let imgPoint = new OpenSeadragon.Point(parseInt(point.x), parseInt(point.y));
            let vpPoint = this.viewer.viewport.imageToViewportCoordinates(imgPoint);
            this.appendDot(vpPoint);
        }
    }

    appendDot(vpPoint) {
        this.dots.push(new Dot(this.overlay, this.viewer, this, this.dots.length, vpPoint, this.zoom, false));
        this.draw(d3.curveCardinalOpen);
    }

    draw(curveType) {
        let points = [];
        for (let dot of this.dots) {
            points.push([dot.p.x, dot.p.y]);
        }
        if(this.labelId === 0 && this.lineId === 2) {
            console.log(curveType);
            console.log(this.drawState);
        }
        this.d3obj.datum(points)
            .attr('d', d3.line()
                           .curve(curveType));
    }

    save() {
        this.color = 'green';
        this.d3obj.classed('accept', true);
        this.complete = true;
        this.selected = false;
        this.selectedDot = false;
        this.draw(d3.curveCardinalClosed);
    }

    delete() {
        this.d3obj.remove();
        for (let dot of this.dots) {
            dot.delete();
        }
        this.dots = [];
    }

}