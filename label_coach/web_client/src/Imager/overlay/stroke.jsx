import Shape from "./shape";
import * as d3 from "d3";
import OpenSeadragon from "openseadragon";
import * as svgIntersections from "svg-intersections";
import Dot from "./dot";

export default class Stroke extends Shape {
    constructor(overlay, viewer, label, id, size, zoom, debug = false) {
        super(overlay, viewer);
        this.R = 0.0015;
        this.size = size;
        this.r = this.R * this.size;
        this.label = label;
        this.id = id;
        this.zoom = zoom;
        this.isCursor = false;
        this.points = [];
        this.debug = debug;
        this.minDist = (this.r * (1 / this.zoom)) / 2;
        // to be overridden
        this.mainPath = this.createPath();
    }

    createPath() {

    }

    intersect(stroke) {
        let ret = [];
        if (this.points.length > 1) {
            for (let i = 0; i < this.points.length - 1; i++) {
                let a1 = this.points[i];
                let a2 = this.points[i + 1];
                if (this.debug) {
                    a1.debug(true);
                    a2.debug(true);
                }
                for (let j = 0; j < stroke.points.length - 1; j++) {
                    let b1 = stroke.points[j];
                    let b2 = stroke.points[j + 1];
                    if (this.debug) {
                        b1.debug(true);
                        b2.debug(true);
                    }
                    let inter = Stroke.intersectLineLine(a1.p, a2.p, b1.p, b2.p);
                    if (inter !== null) {
                        ret.push(inter);
                    }
                    if (this.debug) {
                        b1.debug(false);
                        b2.debug(false);
                    }
                }
                if (this.debug) {
                    a1.debug(false);
                    a2.debug(false);
                }
            }
        }
        return ret;
    }

    static intersectLineLine(a1, a2, b1, b2) {
        // borrowed from https://github.com/thelonious/kld-intersections/blob/development/lib/Intersection.js
        let result = null;

        let ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
        let ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
        let u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

        if (u_b !== 0) {
            let ua = ua_t / u_b;
            let ub = ub_t / u_b;

            if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                result = {
                    'x': a1.x + ua * (a2.x - a1.x),
                    'y': a1.y + ua * (a2.y - a1.y)
                };
            }
            else {
                result = null;
            }
        }
        else {
            if (ua_t === 0 || ub_t === 0) {
                // coincident so sent away any point on b
                result = {
                    'x': b1,
                    'y': b2
                };
            }
            else {
                //parallel
                result = null;
            }
        }

        return result;
    }

    setCursorPos(x, y) {
        this.fillCursorColor();
        this.cursor
            .attr("cx", x)
            .attr("cy", y);
    }

    fillCursorColor() {
        if (this.cursor) {
            this.cursor.attr("fill", this.label.color);
        }
    }

    onMouseMove(vpPoint) {
        if (this.label && this.isCursor) {
            this.setCursorPos(vpPoint.x, vpPoint.y);
            document.body.style.cursor = "crosshair";
        } else {
            this.cursor = this.createCursor();
            this.isCursor = true;
        }

    }

    onExit() {
        if (this.isCursor) {
            this.cursor.remove();
            this.isCursor = false;
        }
        document.body.style.cursor = "auto";
    }

    onMouseDragEnd() {
        //this.cursor = this.createCursor();
    }

    onMouseDrag(vpPoint) {
        if (this.label && this.isCursor) {
            this.setCursorPos(vpPoint.x, vpPoint.y);
            return this.appendDot(vpPoint);
        }

        return false;
    }

    createCursor() {
        return d3.select(this.overlay.getNode(1))
                 .append("circle")
                 .attr('class', 'dot')
                 .attr('id', 'c' + this.id)
                 .attr("r", this.r * (1 / this.zoom));
    }

    onEnter() {
        // TODO need a better way to check if cursor is removed. It bugs out otherwise
        if (!this.isCursor) {
            this.isCursor = true;
            this.cursor = this.createCursor();
        }
    }

    getImagePoints() {
        let points = [];
        for (let p of this.points) {
            points.push(this.viewer.viewport.viewportToImageCoordinates(p.p));
        }
        return points;
    }


    addImagePoints(points) {
        for (let point of points) {
            let imgPoint = new OpenSeadragon.Point(parseInt(point.x), parseInt(point.y));
            let vpPoint = this.viewer.viewport.imageToViewportCoordinates(imgPoint);
            this.appendDot(vpPoint);
        }

    }

    static dist(p1, p2) {
        return Math.pow(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2), 0.5)
    }

    appendDot(vpPoint) {
        let prevPoint = this.points[this.points.length - 1];
        if (prevPoint === undefined || Stroke.dist(prevPoint.p, vpPoint) >= this.minDist) {
            let dot = new Dot(this.overlay, this.viewer, this, this.points.length - 1, vpPoint, this.zoom, this.debug,
                              false, false);
            this.points.push(dot);
            this.draw(d3.curveCardinalOpen);
            return true;
        }
        return false;
    }

    draw(curveType) {
        let line = d3.line()
                     .x(d => {
                         return d[0]
                     })
                     .y(d => {
                         return d[1]
                     })
                     .curve(curveType);
        let points = [];
        for (let dot of this.points) {
            points.push([dot.p.x, dot.p.y]);
        }
        this.mainPath.attr('d', line(points));
    }

    setSize(size) {
        this.size = size;
        this.r = this.R * this.size;
        this.mainPath.attr('stroke-width', this.r * 2 * (1 / this.zoom))
    }


    delete() {
        if (this.cursor) {
            this.cursor.remove();
        }
        if (this.mainPath) {
            this.mainPath.remove();
        }
        for (let point of this.points) {
            point.delete();
        }
        this.points = [];
    }
}
