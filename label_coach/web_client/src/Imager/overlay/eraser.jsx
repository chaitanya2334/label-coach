import * as d3 from "d3";
import OpenSeadragon from "openseadragon";
import Stroke from "./stroke";

export default class Eraser extends Stroke {
    constructor(overlay, viewer, label, id, size, zoom) {
        super(overlay, viewer, label, id, size, zoom);
        this.erasedBrushes = [];

    }

    createPath() {
        this.mask = d3.select(this.overlay.svg())
                      .select('mask#eraser_' + this.label.id);
        if (this.mask._groups[0][0] == null) {
            this.mask = d3.select(this.overlay.svg())
                          .append("mask")
                          .attr("id", "eraser_" + this.label.id);
        }
        this.rect = this.mask.select('rect');
        if (this.rect._groups[0][0] == null) {
            this.mask.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "white");
        }
        return this.mask
                   .append("path")
                   .attr("stroke", "black")
                   .attr("fill", "transparent")
                   .attr('id', this.label.id.toString() + "_" + "0")
                   .attr('stroke-width', this.r * 2 * (1 / this.zoom))
                   .attr("stroke-linecap", "round")
                   .attr("opacity", 1);
    }

    fillCursorColor() {
        if (this.cursor) {
            this.cursor.attr('fill', 'white')
                .attr('stroke', this.label.color);
        }
    }

    createCursor() {
        return d3.select(this.overlay.getNode(1))
                 .append("circle")
                 .attr('fill', 'white')
                 .attr('stroke', this.label.color)
                 .attr('stroke-width', this.R)
                 .attr('class', 'dot')
                 .attr('id', 'c' + this.id)
                 .attr("r", this.r * (1 / this.zoom));
    }

    getErasedBrushes(activeBrushes){
        // delete brush strokes if the eraser intesects
        for (let brush of activeBrushes) {
            if (brush.label.id === this.label.id) {
                if (this.intersect(brush).length > 0) {
                    this.erasedBrushes.push(brush);
                }
            }
        }
        return this.erasedBrushes;
    }

    delete() {
        super.delete();

        d3.select(this.overlay.svg())
          .selectAll('mask')
          .selectAll('path')
          .remove();
        d3.select(this.overlay.svg())
          .selectAll('mask')
          .selectAll('rect')
          .remove();
        this.mask.remove();
    }
}
