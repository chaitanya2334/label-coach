import Shape from "./shape"
import OpenSeadragon from "openseadragon";
import "./osdSvgOverlay";
import * as d3 from 'd3';
import Dot from "./dot";

export default class Line extends Shape {
    constructor(overlay, viewer, label, lineId, zoom, addLine) {
        super(overlay, viewer);
        this.lineId = lineId;
        this.labelId = label.id;
        this.zoom = zoom;
        this.strokeWidth = 0.002;
        this.d3obj = d3.select(this.overlay.getNode(0))
                       .append("path")
                       .attr('stroke', label.color)
                       .attr('id', this.labelId + "_" + this.lineId)
                       .attr('class', 'transparent')
                       .attr('id', this.lineId)
                       .attr('stroke-width', this.strokeWidth * (1 / this.zoom));
        this.dots = [];
        this.setDrawState("read-only");
        this.addLine = addLine;
        this.curveTension = 1;
        this.curveType = d3.curveCardinalClosed.tension(this.curveTension);
    }

    onEnter() {

    }

    onExit() {
        document.body.style.cursor = "auto";
    }

    onMouseMove(vpPoint) {
        document.body.style.cursor = "crosshair";

    }

    onDrag(vpPoint){
        this.appendDot(vpPoint);
        this.curveType = d3.curveCardinalOpen.tension(this.curveTension);
    }

    onDragEnd(){
        // connect back to the first point
        this.curveType = d3.curveCardinalClosed.tension(this.curveTension);
        this.save();
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
        if (points !== undefined) {
            for (let point of points) {
                let imgPoint = new OpenSeadragon.Point(parseInt(point.x), parseInt(point.y));
                let vpPoint = this.viewer.viewport.imageToViewportCoordinates(imgPoint);
                this.appendDot(vpPoint);
            }
        }
    }

    appendDot(vpPoint) {
        this.dots.push(new Dot(this.overlay, this.viewer, this, this.dots.length, vpPoint, this.zoom, false));
        this.draw();
    }

    draw() {
        let points = [];
        for (let dot of this.dots) {
            points.push([dot.p.x, dot.p.y]);
        }
        if (this.labelId === 0 && this.lineId === 2) {
            console.log(this.curveType);
            console.log(this.drawState);
        }
        this.d3obj.datum(points)
            .attr('d', d3.line()
                         .curve(this.curveType));
    }

    save() {
        this.color = 'green';
        this.d3obj.classed('accept', true);
        this.complete = true;
        this.selected = false;
        this.selectedDot = false;
        this.draw();
        this.addLine(this.labelId, this.lineId, this.getImagePoints());
    }

    delete() {
        this.d3obj.remove();
        for (let dot of this.dots) {
            dot.delete();
        }
        this.dots = [];
    }

}