import * as d3 from "d3";
import Stroke from "./stroke";

export default class Brush extends Stroke {
    constructor(overlay, viewer, label, selected, id, brushSize, zoom) {
        super(overlay, viewer, label, selected, id, brushSize, zoom);

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
                 .attr("opacity", 0.7)
                 .attr("mask", "url(#eraser_" + this.label.id + ")");
    }

    delete() {
        super.delete();
    }
}
