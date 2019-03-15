import Stroke from "./stroke";

export default class Brush extends Stroke {
    constructor(overlay, viewer, id, label = null, radius = null, labelFolderId = null, updateStrokes = null,
                updateLabelImage = null, genMask = false) {
        super(overlay, viewer, id, label.color, label.color, radius, labelFolderId, updateStrokes, updateLabelImage, genMask);
        this.label = label;

    }


    saveToImage() {
        let transform = this.canvas.viewportTransform.slice();
        this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        // Do something here
        let objects = this.canvas.toJSON().objects;
        let jsonObj = objects[objects.length - 2];
        jsonObj.id = objects.length - 2;
        this.canvas.viewportTransform = transform;
        this.canvas.renderAll();
        this.updateStrokes(this.labelFolderId, "brushes", this.label.id, this.id, jsonObj, transform);
        this.id++;
        if (this.genMask) {
            this.maskImage = this.maskify();
            this.updateLabelImage(this.label.name, this.labelFolderId, this.maskImage);
        }


    }
}