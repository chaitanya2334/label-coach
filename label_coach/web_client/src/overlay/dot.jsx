import OpenSeadragon from "openseadragon";
import Shape from "./shape";
import "./osdSvgOverlay";
import "./dot.css";
import * as d3 from "d3";

export default class Dot extends Shape {
    constructor(overlay, id, vpPoint, zoom) {
        super(overlay);
        this.zoom = zoom;
        if (vpPoint) {
            this.p = vpPoint;
        } else {
            this.p = new OpenSeadragon.Point(0, 0);
        }
        this.R = 0.002;
        this.onHoverR = 0.004;
        this.r = this.R*(1/this.zoom);
        this.draw(this.p, id);
    }

    updateR(){
        this.d3obj.attr('r', this.r)
    }

    onZoom(event){
        this.r = this.R*(1/event.zoom);
        this.updateR();
    }

    draw(vpPoint, id) {
        this.d3obj = d3.select(this.overlay.node())
                       .append("circle")
                       .attr('class', 'dot')
                       .attr('id', 'c' + id)
                       .attr("cx", vpPoint.x)
                       .attr("cy", vpPoint.y)
                       .attr("r", this.r);

        this.d3obj.on('dblclick', (event) => {
            this.dblClicked = true
        });
        this.d3obj.on('mouseover', (event) => {
            this.r = this.onHoverR * (1 / this.zoom);
            this.updateR();
        });
        this.d3obj.on('mouseout', (event) => {
            this.r = this.R * (1 / this.zoom);
            this.updateR();
        });
    }

    update(viewportPoint) {
        this.p = viewportPoint;
        this.d3obj.attr('cx', this.p.x)
            .attr('cy', this.p.y);
    }

    isSame(dot) {
        if (dot instanceof Dot) {
            return (this.p === dot.p)
        } else {
            throw("dot is not an instance of Dot class");
        }
    }

    isDblClicked(){
        return this.dblClicked;
    }

}
