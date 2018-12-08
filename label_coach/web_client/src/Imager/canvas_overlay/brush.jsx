export default class Brush {
    constructor(overlay, viewer, id, label = null, radius = null, labelFolderId = null, updateStrokes = null) {
        this.path = [];
        this.overlay = overlay;
        this.viewer = viewer;
        this.canvas = overlay.fabricCanvas();
        this.label = label;
        this.radius = radius;
        this.updateStrokes = updateStrokes;
        this.id = id;
        this.labelFolderId = labelFolderId;
        var cursorOpacity = .5;
        this.mousecursor = new fabric.Circle({
                                                 left: -100,
                                                 top: -100,
                                                 radius: radius / 2,
                                                 fill: label.color,
                                                 stroke: "black",
                                                 originX: 'center',
                                                 originY: 'center'
                                             });
        this.canvas.add(this.mousecursor);

    }

    activate() {
        this.canvas.freeDrawingBrush.color = this.label.color;
        this.canvas.freeDrawingBrush.width = this.radius;
        this.canvas.globalCompositeOperation = "source-over";
        this.viewer.setMouseNavEnabled(false);
        this.viewer.outerTracker.setTracking(false);
        this.canvas.isDrawingMode = true;
        this.canvas.on('path:created', (e) => {
            e.path.globalCompositeOperation = 'source-over';
            // This will not add an SVG CSS class, but at least will allow us to identify
            // erasures in object list
            this.canvas.renderAll();
        });
        this.canvas.on("mouse:down", () => {
            if (!this.drawing) {
                this.canvas.remove(this.mousecursor);
                this.mousecursor = null;

                this.canvas.renderAll();
                this.drawing = 1;
            }
        });
        this.canvas.on("mouse:move", (evt) => {
            if (!this.drawing) {
                let mouse = this.canvas.getPointer(evt.e);
                this.mousecursor
                    .set({
                             top: mouse.y,
                             left: mouse.x
                         })
                    .setCoords();
                this.canvas.renderAll();
            }
        });
        this.canvas.on("mouse:out", () => {
            if (!this.drawing) {
                this.mousecursor.set({
                                         top: -100,
                                         left: -100
                                     })
                    .setCoords();
                this.canvas.renderAll();
            }
        });
        this.canvas.on("mouse:up", () => {
            if (this.drawing) {
                this.mousecursor = new fabric.Circle({
                                                         left: -100,
                                                         top: -100,
                                                         radius: this.radius / 2,
                                                         fill: this.label.color,
                                                         stroke: "black",
                                                         originX: 'center',
                                                         originY: 'center'
                                                     });
                this.canvas.add(this.mousecursor);
                this.canvas.renderAll();
                this.drawing = 0;
            }
            this.saveToImage();
            this.canvas.__eventListeners["mouse:up"] = [];
        });

    }

    deactivate() {
        this.viewer.setMouseNavEnabled(true);
        this.viewer.outerTracker.setTracking(true);
        this.canvas.isDrawingMode = false;
        this.canvas.__eventListeners["mouse:up"] = [];
        this.canvas.__eventListeners["mouse:created"] = [];
        this.canvas.__eventListeners["object:added"] = [];
        this.canvas.__eventListeners["mouse:out"] = [];
        this.canvas.__eventListeners["mouse:move"] = [];
        this.canvas.__eventListeners["mouse:move"] = [];
    }

    saveToImage() {
        let transform = this.canvas.viewportTransform.slice();
        this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        // Do something here
        let objects = this.canvas.toJSON().objects;
        let jsonObj = objects[objects.length - 2];
        this.canvas.viewportTransform = transform;
        this.canvas.renderAll();
        this.updateStrokes(this.labelFolderId, "brushes", this.label.id, this.id, jsonObj, transform);
        this.id++;


    }

    loadFromImage(imgSrc, transform) {
        fabric.loadSVGFromURL(imgSrc, (objects, options) => {
            let obj = fabric.util.groupSVGElements(objects, options);
            this.canvas.add(obj);
            obj.setCoords();

            this.canvas.renderAll();
            this.canvas.viewportTransform = transform;
        });
    }
}