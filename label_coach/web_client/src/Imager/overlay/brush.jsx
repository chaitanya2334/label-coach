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
        this.d3paths.push(d3.select(this.overlay.node())
                            .append("path")
                            .attr("stroke", this.label.color)
                            .attr("fill", "transparent")
                            .attr('id', this.label.id.toString() + "_" + "0")
                            .attr('stroke-width', this.r * 2 * (1 / this.zoom))
                            .attr("stroke-linecap", "round")
                            .attr("opacity", 1));

        this.filter = d3.select(this.overlay.svg())
                        .append('filter')
                        .attr("id", "constantOpacity")
                        .append("feComponentTransfer")
                        .append("feFuncA")
                        .attr("type", "table")
                        .attr("tableValues", "0 .2 .2");
        d3.select(this.overlay.node())
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
        this.d3paths.push(d3.select(this.overlay.node())
                            .append("path")
                            .attr("stroke", this.label.color)
                            .attr("fill", "transparent")
                            .attr('id', this.label.id.toString() + "_" + this.d3paths.length.toString())
                            .attr('stroke-width', this.r * 2 * (1 / this.zoom))
                            .attr("stroke-linecap", "round")
                            .attr("opacity", 1));
    }

    onMouseDrag(vpPoint) {
        this.appendDot(vpPoint);
    }

    onEnter() {
        // TODO need a better way to check if cursor is removed. It bugs out otherwise
        if (!this.isCursor) {
            this.isCursor = true;
            this.cursor = d3.select(this.overlay.node())
                            .append("circle")
                            .attr('class', 'dot')
                            .attr('id', 'c' + this.id)
                            .attr("r", this.r * (1 / this.zoom));
        }

    }


    addImagePoints(points) {
        for (let point of points) {
            let imgPoint = new OpenSeadragon.Point(parseInt(point.x), parseInt(point.y));
            let vpPoint = this.viewer.viewport.imageToViewportCoordinates(imgPoint);
            this.appendDot(vpPoint);
        }
    }

    appendDot(vpPoint) {
        this.paths[this.paths.length - 1].push(vpPoint);
        this.draw(d3.curveCardinalOpen);
    }

    draw(curveType) {

        for (let i in this.paths) {
            let points = [];
            for (let dot of this.paths[i]) {
                points.push([dot.x, dot.y]);
            }
            this.d3paths[i].datum(points)
                           .attr('d', d3.line()
                                        .curve(curveType));
        }
    }

    static midPointBtw(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    }

    delete() {
        if (this.cursor) {
            this.cursor.remove();
        }
    }
}
