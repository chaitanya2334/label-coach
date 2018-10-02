import Shape from "./shape";
import * as d3 from "d3";
import OpenSeadragon from "openseadragon";

export default class Brush extends Shape {
    constructor(overlay, viewer, label, brushSize, zoom) {
        super(overlay, viewer);
        this.R = 0.0015 * brushSize;

        this.r = this.R;
        this.points = [];
        this.label = label;
        this.id = 0;
        this.zoom = zoom;
        this.isCursor = false;
        this.paths = [];
        this.paths.push([]);
        this.d3paths = [];
        this.minDist = (this.r * (1 / this.zoom))/2;
        this.mainPath = d3.select(this.overlay.getNode(0))
                          .append("path")
                          .attr("stroke", this.label.color)
                          .attr("stroke-alignment", "inner")
                          .attr("fill", "none")
                          .attr('id', "MAIN" + "_" + "0")
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
        this.paths.push([]);
        //this.cursor = this.createCursor();
    }

    onMouseDrag(vpPoint) {
        this.cursor
                .attr("fill", this.label.color)
                .attr("cx", vpPoint.x)
                .attr("cy", vpPoint.y);
        this.appendDot(vpPoint);
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
        let path = this.paths[this.paths.length - 1];

        let prevPoint = path[path.length - 1];
        if (prevPoint === undefined || Brush.dist(prevPoint, vpPoint) >= this.minDist) {
            this.paths[this.paths.length - 1].push(vpPoint);
            this.draw(d3.curveCardinalOpen);
        }

    }

    polyToPath() {

    }

    pathToPoly() {

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
        let lines = [];
        for (let i in this.paths) {
            let points = [];
            for (let dot of this.paths[i]) {
                points.push([dot.x, dot.y]);
            }
            lines.push(line(points))
        }
        this.mainPath.attr('d', lines.join(" "))

    }


    delete() {
        if (this.cursor) {
            this.cursor.remove();
            this.mainPath.remove();
            this.filter.remove();

        }
    }
}
