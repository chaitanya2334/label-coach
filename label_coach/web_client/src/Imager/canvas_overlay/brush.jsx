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

    }

    activate() {
        this.canvas.freeDrawingBrush.color = this.label.color;
        this.canvas.freeDrawingBrush.width = this.radius;
        this.canvas.globalCompositeOperation="source-over";
        this.viewer.setMouseNavEnabled(false);
        this.viewer.outerTracker.setTracking(false);
        this.canvas.isDrawingMode = true;
        this.canvas.on('path:created', (e) => {
            e.path.globalCompositeOperation = 'source-over';
            // This will not add an SVG CSS class, but at least will allow us to identify
            // erasures in object list
            this.canvas.renderAll();
        });
        this.canvas.on("mouse:up", () => {
            this.saveToImage();
            this.canvas.__eventListeners["mouse:up"] = [];
        })
    }

    deactivate() {
        this.viewer.setMouseNavEnabled(true);
        this.viewer.outerTracker.setTracking(true);
        this.canvas.isDrawingMode = false;
        this.canvas.__eventListeners["mouse:up"] = [];
        this.canvas.__eventListeners["mouse:created"] = [];
    }

    saveToImage() {
        let transform = this.canvas.viewportTransform.slice();
        this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        let dataurl = this.canvas.toJSON();
        this.canvas.viewportTransform = transform;
        this.canvas.renderAll();
        this.updateStrokes(this.labelFolderId, "brushes", this.label.id, this.id, dataurl, transform);
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