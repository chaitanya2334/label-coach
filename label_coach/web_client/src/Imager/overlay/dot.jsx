import OpenSeadragon from "openseadragon";
import Shape from "./shape";
import "./osdSvgOverlay";
import "../../styles/Dot.css";
import * as d3 from "d3";
import clone from "../../utils"

export default class Dot extends Shape {
    constructor(overlay, viewer, parent, id, vpPoint, zoom, visible = true, setRingColor = false, onHover = false) {
        super(overlay, viewer);
        this.visible = visible;
        this.selected = false;
        this.parent = parent;
        this.zoom = zoom;
        if (vpPoint) {
            this.p = vpPoint;
        } else {
            this.p = new OpenSeadragon.Point(0, 0);
        }
        this.R = 0.002;
        this.onHoverR = 0.004;
        this.setRingColor = setRingColor;
        this.onHover = onHover;
        this.r = this.R;
        this.draw(this.p, id);

    }

    debug(on){
        if(on){
            this.d3obj.attr('fill', 'blue');
        }else{
            this.d3obj.attr('fill', 'red')
        }
    }

    delete() {
        if (this.d3obj) {
            this.d3obj.remove();
        }
    }

    getImgPoint() {
        return this.viewer.viewport.viewportToImageCoordinates(this.p);
    }

    updateR() {
        let r = this.r * (1 / this.zoom);
        this.d3obj.attr('r', r);
    }

    translateDot(tx, ty) {
        this.p.x = this.center.x + tx;
        this.p.y = this.center.y + ty;
        console.log(this.center);
        this.update(this.p);
    }

    onZoom(event) {
        this.zoom = event.zoom;
        this.updateR();
    }

    saveOrigPos() {
        this.center = clone(this.p);
    }

    setColor(color) {
        this.d3obj.attr('fill', color);
    }

    draw(vpPoint, id) {
        if (this.visible) {
            this.d3obj = d3.select(this.overlay.getNode(0))
                           .append("circle")
                           .attr('class', 'dot')
                           .attr('fill', 'red')
                           .attr('id', 'c' + id)
                           .attr("cx", vpPoint.x)
                           .attr("cy", vpPoint.y)
                           .attr("r", this.r * (1 / this.zoom))
                           .on('mouseover', (event) => {
                               this.selected = true;
                               this.r = this.onHoverR;
                               this.updateR()
                           })
                           .on('mouseout', (event) => {
                               this.selected = false;
                               this.r = this.R;
                               this.updateR();
                           })
                           .on('mousemove', (event) => {
                               console.log(event);
                           });

            if (this.setRingColor) {
                this.d3obj.attr("stroke", 'red')
                    .attr("stroke-width", this.r)
            }
        }
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

    isDblClicked() {
        return this.selected;
    }

}
