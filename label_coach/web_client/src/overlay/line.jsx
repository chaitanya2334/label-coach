import Shape from "./shape"
import OpenSeadragon from "openseadragon";
import "./osdSvgOverlay";
import * as d3 from 'd3';

export default class Line extends Shape {
    constructor(overlay, id, vpPoint1, vpPoint2){
        super(overlay);
        if(vpPoint1){
            this.p1 = vpPoint2;
        }else{
            this.p1 = new OpenSeadragon.Point(0, 0);
        }
        if(vpPoint2){
            this.p2 = vpPoint2;
        }else{
            this.p2 = new OpenSeadragon.Point(0, 0);
        }
        this.draw(this.p1, this.p2);
    }

    draw(vpPoint1, vpPoint2) {

        this.d3obj = d3.select(this.overlay.node())
                       .append("line")
                       .style('fill', '#f00')
                       .attr('id', 'c1')
                       .attr('x1', vpPoint1.x)
                       .attr('y1', vpPoint1.y)
                       .attr('x2', vpPoint2.x)
                       .attr('y2', vpPoint2.y)
                       .attr('stroke-width', 2)
                       .attr('stroke', 'black');
    }

    update(vpPoint1, vpPoint2) {
        this.p1 = vpPoint1;
        this.p2 = vpPoint2;
        this.d3obj.attr('x1', this.p1.x)
            .attr('y1', this.p1.y)
            .attr('x2', this.p2.x)
            .attr('y2', this.p2.y)
    }
}