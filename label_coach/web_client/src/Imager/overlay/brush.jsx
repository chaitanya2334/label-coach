import * as d3 from "d3";
import Stroke from "./stroke";

export default class Brush extends Stroke {
    constructor(overlay, viewer, label, id, brushSize, zoom) {
        super(overlay, viewer, label, id, brushSize, zoom);

    }

    createPath() {
        return d3.select(this.overlay.getNode(0))
                 .append("path")
                 .attr("stroke", this.label.color)
                 .attr("stroke-alignment", "inner")
                 .attr("fill", "none")
                 .attr('id', "MAIN" + "_" + this.id)
                 .attr('stroke-width', this.r * 2 * (1 / this.zoom))
                 .attr("stroke-linecap", "round")
                 .attr("opacity", 0.3)
                 .attr("mask", "url(#eraser_" + this.label.id + ")");
    }

    static dist(p1, p2) {
        return Math.pow(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2), 0.5)
    }


    delete() {
        super.delete();
    }
}
