import Shape from "./shape"
import Dot from "./dot"
import * as d3 from "d3";
import "../../styles/Polygon.css";
import OpenSeadragon from "openseadragon";


export default class Polygon extends Shape {
    constructor(overlay, viewer, label, drawState, selected, poly_id, zoom, addPolygon) {
        super(overlay, viewer);
        this.zoom = zoom;
        this.dots = [];
        this.selected = null;
        this.strokeWidth = 0.002;
        this.R = 0.002;
        this.d3obj = d3.select(this.overlay.getNode(0))
                       .append("polyline")
                       .attr('stroke', label.color)
                       .attr('class', 'transparent')
                       .attr('id', label.id + "_" + poly_id)
                       .attr('stroke-width', this.strokeWidth * (1 / this.zoom))
                       .on('mouseover', (event) => {
                           console.log("asdfwQr_{+R4EDQAzB ,NB HMV");
                       });

        this.d3obj.on('mouseover', (event) => {
            this.inside = true;
        });
        this.d3obj.on('mouseout', (event) => {
            this.inside = false;
        });
        this.complete = false;
        this.drawState = selected ? "selected" : drawState;
        this.label = label;
        this.poly_id = poly_id;

        this.CLOSE_THRESH = 0.001;
        this.minDist = 0.001;
        this.addPolygon = addPolygon;
        this.stateToDotColor = {
            "create": this.label.color,
            "edit": 'red',
            "read_only": this.label.color,
            "selected": 'red'
        };
        this.stateToLineColor = {
            "create": this.label.color,
            "edit": 'red',
            "read_only": this.label.color,
            "selected": 'red'
        };
    }

    setDrawState(state) {
        this.drawState = state;
    }

    onEnter() {

    }

    onExit() {
        document.body.style.cursor = "auto";
    }

    onMouseMove(vpPoint) {
        document.body.style.cursor = "crosshair";
        switch (this.drawState) {
            case "edit":
                if (this.selectedDot) {
                    this.movePotentialPoint(vpPoint);
                } else {
                    this.dotOnPerimeter(vpPoint);
                }
                break;
            case "create":
                this.movePotentialPoint(vpPoint);
                break;
        }

    }

    addImagePoints(points) {
        for (let point of points) {
            let imgPoint = new OpenSeadragon.Point(parseInt(point.x), parseInt(point.y));
            let vpPoint = this.viewer.viewport.imageToViewportCoordinates(imgPoint);
            this.appendDot(vpPoint);
        }
    }

    delete() {
        if (this.cursor) {
            this.cursor.remove();
        }
        this.d3obj.remove();
        for (let dot of this.dots) {
            dot.d3obj.remove();
        }
        this.dots = [];
    }

    isClose(v, w) {
        function sqr(x) {
            return x * x
        }

        return sqr(v.x - w.x) + sqr(v.y - w.y) < this.minDist
    }

    setState(state) {
        switch (state) {
            case "edit":
                this.potentialDot = new Dot(this.overlay, this.viewer, this, this.dots.length, null, this.zoom, true);
                break;
        }
    }

    onSelect(viewportPoint) {
        switch (this.drawState) {
            case "create":
                if (this.dots.length > 0 && this.isClose(viewportPoint, this.dots[0].p)) {
                    this.appendDot(this.dots[0].p);
                    this.save();
                } else {
                    this.appendDot(viewportPoint);
                }
                break;

            case "edit":
                if (this.selectedDot) {
                    this.updateDot(viewportPoint);
                    this.save();
                    this.props.updatePolygon(this.label_id, this.poly_id,
                                             this.getImgPoints());
                } else {
                    this.selectedDot =
                        this.insertDot(this.potentialDot,
                                       this.potentialDotLeftId);
                }
                break;
        }
    }

    onDblClick(event) {
        let viewportPoint = super.onDblClick(event);
        if (this.drawState === "edit") {
            if (this.selected) {
                this.save();
            } else {
                this.selected = viewportPoint;
                this.setDotsCenter();
            }
        }
    }

    appendDot(vpPoint) {

        let isFirst = (this.drawState === "create" && this.dots.length === 0);
        this.dots.push(new Dot(this.overlay,
                               this.viewer,
                               this,
                               this.dots.length,
                               vpPoint,
                               this.zoom,
                               true,
                               isFirst));
        this.updatePolygon();
    }

    isBeingEdited(vpPoint) {
        for (let dot of this.dots) {
            if (dot.isDblClicked()) {
                this.selectedDot = dot;
                return true;
            }
        }

        if (this.inside) {
            this.selected = vpPoint;
            this.setDotsCenter(); //save the original points to calculate the translation from these points on moving
            return true;
        }
    }

    setDotsCenter() {
        for (let dot of this.dots) {
            dot.saveOrigPos();
        }
    }

    movePolygon(center, vpPoint) {
        this.d3obj.classed('accept', false);
        let x = vpPoint.x - center.x;
        let y = vpPoint.y - center.y;
        for (let dot of this.dots) {
            dot.translateDot(x, y);
        }
        this.updatePolygon();
    }

    updateDot(vpPoint) {
        this.selectedDot.update(vpPoint);
        this.updatePolygon();
    }

    save() {
        this.color = 'green';
        this.d3obj.classed('accept', true);
        this.complete = true;
        this.selected = false;
        this.selectedDot = false;
        this.updatePolygon();
        this.addPolygon(this.label.id, this.poly_id, this.getImgPoints());
    }

    onZoom(event) {
        for (let dot of this.dots) {
            dot.onZoom(event);
        }
        if (this.potentialDot) {
            this.potentialDot.onZoom(event);
        }
        if (this.selectedDot) {
            this.selectedDot.onZoom(event);
        }
        this.d3obj.attr('stroke-width', this.strokeWidth * (1 / event.zoom));
        this.zoom = event.zoom;
    }

    closestPoint(polyNode, point) {


        function dist2(v, w) {
            function sqr(x) {
                return x * x
            }

            return sqr(v.x - w.x) + sqr(v.y - w.y)
        }

        function distToSegmentSquared(p, v, w) {
            let l2 = dist2(v, w);
            if (l2 === 0) return dist2(p, v);
            let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            let proj = {
                x: v.x + t * (w.x - v.x),
                y: v.y + t * (w.y - v.y)
            };
            return {
                dist: dist2(p, proj),
                point: proj,
            };
        }

        let pairs = [];
        let minProj, minLeftId, minDist = Infinity;
        for (let i = 0; i < this.dots.length; i++) {
            let j = (i + 1) % this.dots.length;
            let res = distToSegmentSquared(point, this.dots[i].p, this.dots[j].p);
            if (res.dist < minDist) {
                minProj = res.point;
                minLeftId = i;
                minDist = res.dist;
            }

        }
        return {point: minProj, leftId: minLeftId};
    }

    insertDot(newDot, leftDotId) {
        for (let dot of this.dots) {
            if (Math.abs(newDot.p.x - dot.p.x) < this.CLOSE_THRESH &&
                Math.abs(newDot.p.y - dot.p.y) < this.CLOSE_THRESH) {
                newDot.delete();
                return dot;
            }
        }
        this.dots.splice(leftDotId + 1, 0, newDot);
        return newDot;
    }


    dotOnPerimeter(vpPoint) {
        let pointDesc = this.closestPoint(this.d3obj, vpPoint);
        this.potentialDot.update(pointDesc.point);
        this.potentialDotLeftId = pointDesc.leftId;
    }

    movePotentialPoint(vpPoint) {
        if (this.selectedDot) {
            this.updateDot(vpPoint);
        } else if (this.selected) {
            this.movePolygon(this.selected, vpPoint);
        } else {
            this.updatePolygon(vpPoint);
        }
    }

    getImgPoints() {
        let points = [];
        for (let dot of this.dots) {
            points.push(dot.getImgPoint());
        }
        return points;
    }

    updatePolygon(vpPoint) {
        let points = "";
        this.d3obj.attr('stroke', this.stateToLineColor[this.drawState]);
        if(this.drawState === "selected") {
            this.d3obj.attr('stroke-dasharray', "0.004");
        }else{
            this.d3obj.attr('stroke-dasharray', "");
        }
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].setColor(this.stateToDotColor[this.drawState]);
            let p = this.dots[i].p;
            points += p.x + ',' + p.y + ' ';
        }
        if (vpPoint) {
            points += vpPoint.x + ',' + vpPoint.y;
        }
        this.d3obj.attr('points', points);
    }


    isComplete() {
        return this.complete;
    }
}