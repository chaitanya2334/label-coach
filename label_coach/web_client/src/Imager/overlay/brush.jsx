import Shape from "./shape";
import * as d3 from "d3";
import OpenSeadragon from "openseadragon";

export default class Brush extends Shape {
    constructor(overlay, viewer, label, id, brushSize, zoom) {
        super(overlay, viewer);
        this.R = 0.0015;
        this.brushSize = brushSize;
        this.r = this.R * this.brushSize;
        this.label = label;
        this.id = id;
        this.zoom = zoom;
        this.isCursor = false;
        this.points = [];

        this.minDist = (this.r * (1 / this.zoom)) / 2;
        this.mainPath = d3.select(this.overlay.getNode(0))
                          .append("path")
                          .attr("stroke", this.label.color)
                          .attr("stroke-alignment", "inner")
                          .attr("fill", "none")
                          .attr('id', "MAIN" + "_" + this.id)
                          .attr('stroke-width', this.r * 2 * (1 / this.zoom))
                          .attr("stroke-linecap", "round")
                          .attr("opacity", 1)
                          .attr("mask", "url(#eraser_" + this.label.id + ")");

        this.filter = d3.select(this.overlay.svg())
                        .append('filter')
                        .attr("id", "constantOpacity")
                        .append("feColorMatrix")
                        .attr("type", "matrix")
                        .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0");
        d3.select(this.overlay.svg())
          .attr("filter", "url(#constantOpacity)");
    }

    onMouseMove(vpPoint) {
        if (this.label && this.isCursor) {
            this.cursor
                .attr("fill", this.label.color)
                .attr("cx", vpPoint.x)
                .attr("cy", vpPoint.y);
            document.body.style.cursor = "crosshair";
        } else {
            this.cursor = this.createCursor();
            this.isCursor = true;
        }

    }

    onExit() {
        if (this.isCursor) {
            this.cursor.remove();
            this.isCursor = false;
        }
        document.body.style.cursor = "auto";
    }

    onMouseDragEnd() {
        //this.cursor = this.createCursor();
    }

    onMouseDrag(vpPoint) {
        if (this.label && this.isCursor) {
            this.cursor
                .attr("fill", this.label.color)
                .attr("cx", vpPoint.x)
                .attr("cy", vpPoint.y);
            return this.appendDot(vpPoint);
        }

        return false;
    }

    createCursor() {
        return d3.select(this.overlay.getNode(1))
                 .append("circle")
                 .attr('class', 'dot')
                 .attr('id', 'c' + this.id)
                 .attr("r", this.r * (1 / this.zoom));
    }

    onEnter() {
        // TODO need a better way to check if cursor is removed. It bugs out otherwise
        if (!this.isCursor) {
            this.isCursor = true;
            this.cursor = this.createCursor();
        }
    }

    getImagePoints() {
        let points = [];
        for (let p of this.points) {
            points.push(this.viewer.viewport.viewportToImageCoordinates(p));
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

    static dist(p1, p2) {
        return Math.pow(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2), 0.5)
    }

    appendDot(vpPoint) {
        let prevPoint = this.points[this.points.length - 1];
        if (prevPoint === undefined || Brush.dist(prevPoint, vpPoint) >= this.minDist) {
            this.points.push(vpPoint);
            this.draw(d3.curveCardinalOpen);
            return true;
        }
        return false;
    }

    draw(curveType) {
        let line = d3.line()
                     .x(d => {
                         return d[0]
                     })
                     .y(d => {
                         return d[1]
                     })
                     .curve(curveType);
        let points = [];
        for (let dot of this.points) {
            points.push([dot.x, dot.y]);
        }
        this.mainPath.attr('d', line(points));
    }

    setBrushSize(brushSize){
        this.brushSize = brushSize;
        this.r = this.R * this.brushSize;
        this.mainPath.attr('stroke-width', this.r * 2 * (1 / this.zoom))
    }


    delete() {
        if (this.cursor) {
            this.cursor.remove();
        }
        if (this.mainPath) {
            this.mainPath.remove();
        }
        if (this.filter) {
            this.filter.remove();
        }
        d3.select(this.overlay.svg())
          .selectAll('filter')
          .remove();
        this.paths = [];
    }
}
