import Shape from "./shape"
import Dot from "./dot"
import * as d3 from "d3";
import "./polygon.css"
export default class Polygon extends Shape{
    constructor(overlay, id, zoom){
        super(overlay);
        this.zoom = zoom;
        this.dots = [];
        this.id = id;
        this.strokeWidth = 0.002;
        this.d3obj = d3.select(this.overlay.node())
                       .append("polygon")
                       .attr('class', 'transparent')
                       .attr('id', "poly_" + id)
                       .attr('stroke-width', this.strokeWidth);
        this.complete = false;
    }
    onClick(vpPoint){
        this.dots.push(new Dot(this.overlay, this.dots.length, vpPoint, this.zoom));
        this.updatePolygon();
    }

    onEsc(){
        this.acceptPolygon();
    }

    onZoom(event){
        for(let dot of this.dots){
            dot.onZoom(event);
        }
        this.d3obj.attr('stroke-width', this.strokeWidth*(1/event.zoom));
        this.zoom = event.zoom;
    }

    onMove(vpPoint){
        this.updatePolygon(vpPoint);
    }

    updatePolygon(vpPoint){
        let points = "";
        for(let i = 0; i < this.dots.length; i++){
            let p = this.dots[i].p;
            points += p.x + ',' + p.y + ' ';
        }
        if(vpPoint){
            points += vpPoint.x + ',' + vpPoint.y;
        }
        this.d3obj.attr('points', points);
    }

    acceptPolygon(){
        this.color = 'green';
        this.d3obj.classed('accept', true);
        this.complete = true;
        this.updatePolygon();
    }

    isComplete(){
        return this.complete;
    }
}