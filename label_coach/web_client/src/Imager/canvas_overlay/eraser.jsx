import Stroke from "./stroke";

export default class Eraser extends Stroke{
    constructor(overlay, viewer, id, label = null, radius = null, labelFolderId = null, updateStrokes = null) {
        let cursorColor = "rgba(255,255,255,1)";
        super(overlay, viewer, id, cursorColor, radius, labelFolderId, updateStrokes);
        this.label = label;


    }

    activate() {
        super.activate();
        this.canvas.on('path:created', (e) => {
            e.path.globalCompositeOperation = 'destination-out';
            // This will not add an SVG CSS class, but at least will allow us to identify
            // erasures in object list
            e.path.setOptions({class: 'erasure'});
            this.canvas.renderAll();
        });
    }

    saveToImage() {
        let transform = this.canvas.viewportTransform.slice();
        this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        let jsonObj = this.canvas.item(this.canvas.size() - 2);
        this.canvas.viewportTransform = transform;
        this.canvas.renderAll();
        this.updateStrokes(this.labelFolderId, "brushes", this.label.id, this.id, jsonObj, transform);
        this.id++;
    }
}