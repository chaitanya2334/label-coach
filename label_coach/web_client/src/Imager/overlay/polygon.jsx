import Shape from "./shape"
import Dot from "./dot"
import * as d3 from "d3";
import "./polygon.css";
import OpenSeadragon from "openseadragon";


export default class Polygon extends Shape {
    constructor(overlay, viewer, label_id, poly_id, zoom) {
        super(overlay, viewer);
        this.zoom = zoom;
        this.dots = [];
        this.selected = null;
        this.strokeWidth = 0.002;
        this.d3obj = d3.select(this.overlay.node())
                       .append("polygon")
                       .attr('class', 'transparent')
                       .attr('id', poly_id)
                       .attr('stroke-width', this.strokeWidth * (1 / this.zoom));

        this.d3obj.on('mouseover', (event) => {
            this.inside = true;
        });
        this.d3obj.on('mouseout', (event) => {
            this.inside = false;
        });
        this.complete = false;
        this.drawState = "read-only";
        this.label_id = label_id;
        this.poly_id = poly_id;
        this.potentialDot = new Dot(this.overlay, this.viewer, this, this.dots.length, null, this.zoom, true);
        this.CLOSE_THRESH = 0.001;
    }

    setDrawState(state) {
        this.drawState = state;
    }

    addImagePoints(points) {
        for (let point of points) {
            let imgPoint = new OpenSeadragon.Point(parseInt(point.x), parseInt(point.y));
            let vpPoint = this.viewer.viewport.imageToViewportCoordinates(imgPoint);
            this.appendDot(vpPoint);
        }
    }

    delete() {
        this.d3obj.remove();
        for (let dot of this.dots) {
            dot.d3obj.remove();
        }
        this.dots = [];
    }

    onDblClick(event) {
        // The canvas-click event gives us a position in web coordinates.
        let webPoint = event.position;

        // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
        let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);

        // Convert from viewport coordinates to image coordinates.
        let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);

        if (this.selected) {
            this.acceptPolygon();
        } else {
            this.selected = viewportPoint;
            this.setDotsCenter();
        }
    }

    appendDot(vpPoint) {
        this.dots.push(new Dot(this.overlay, this.viewer, this, this.dots.length, vpPoint, this.zoom, true));
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
    }

    onZoom(event) {
        for (let dot of this.dots) {
            dot.onZoom(event);
        }
        if(this.potentialDot) {
            this.potentialDot.onZoom(event);
        }
        if(this.selectedDot) {
            this.selectedDot.onZoom(event);
        }
        this.d3obj.attr('stroke-width', this.strokeWidth * (1 / event.zoom));
        this.zoom = event.zoom;
    }

    closestPoint(polyNode, point) {
        function sqr(x) {
            return x * x
        }

        function dist2(v, w) {
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
        for (let i = 0; i < this.dots.length; i++) {
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