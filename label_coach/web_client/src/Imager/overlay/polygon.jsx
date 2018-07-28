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
        this.selected = null;
        this.strokeWidth = 0.002;
        this.d3obj = d3.select(this.overlay.node())
                       .append("polygon")
                       .attr('class', 'transparent')
                       .attr('id', "poly_" + id)
                       .attr('stroke-width', this.strokeWidth);

        this.d3obj.on('mouseover', (event)=>{this.inside=true;});
        this.d3obj.on('mouseout', (event)=>{this.inside=false;});
        this.complete = false;
    }
    addDot(vpPoint){
        this.dots.push(new Dot(this.overlay, this, this.dots.length, vpPoint, this.zoom));
        this.updatePolygon();
    }

    isBeingEdited(vpPoint){
        for(let dot of this.dots){
            if(dot.isDblClicked()){
                this.selectedDot = dot;
                return true;
            }
        }

        if(this.inside){
            this.selected = vpPoint;
            this.setDotsCenter(); //save the original points to calculate the translation from these points on moving
            return true;
        }
    }

    setDotsCenter(){
        for(let dot of this.dots){
            dot.saveOrigPos();
        }
    }

    movePolygon(center, vpPoint){
        this.d3obj.classed('accept', false);
        let x = vpPoint.x - center.x;
        let y =  vpPoint.y - center.y;
        for(let dot of this.dots){
            dot.translateDot(x, y);
        }
        this.updatePolygon();
    }

    updateDot(vpPoint){
        this.selectedDot.update(vpPoint);
        this.updatePolygon();
    }

    end(){
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
        if(this.selectedDot){
            this.updateDot(vpPoint);
        }else if(this.selected){
            this.movePolygon(this.selected, vpPoint);
        } else{
            this.updatePolygon(vpPoint);
        }
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
        this.selected = false;
        this.selectedDot = false;
        this.updatePolygon();
    }

    isComplete(){
        return this.complete;
    }
}