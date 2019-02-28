import Stroke from "./stroke";

export default class Brush extends Stroke {
    constructor(overlay, viewer, id, label = null, radius = null, labelFolderId = null, updateStrokes = null,
                updateLabelImage = null) {
        super(overlay, viewer, id, label.color, radius, labelFolderId, updateStrokes, updateLabelImage);
        this.label = label;
        this.maskImage = this.maskify();
    }

    maskify() {
        let canvas = this.overlay.getFullCanvas();
        let ctx = canvas.getContext();
        let srcImg = canvas.getContext()
                         .getImageData(0, 0, canvas.width, canvas.height);
        let dstImg = ctx.createImageData(srcImg);
        let srcData = srcImg.data;
        let strokeColor = Stroke.hexToRgb(this.cursorColor);
        console.log(strokeColor);
        for (let i = 0, maxI = srcData.length; i < maxI; i += 4) {
            if (srcData[i] === strokeColor.r &&
                srcData[i + 1] === strokeColor.g &&
                srcData[i + 2] === strokeColor.b &&
                srcData[i + 3] === 255) {
                //white
                dstImg.data[i] = dstImg.data[i + 1] = dstImg.data[i + 2] = 255;
            } else {
                //black
                dstImg.data[i] = dstImg.data[i + 1] = dstImg.data[i + 2] = 0;
            }
            //no transparency
            dstImg.data[i + 3] = 255;
        }
        return Stroke.toBase64(dstImg, canvas.width, canvas.height);
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
        this.maskImage = this.maskify();
        this.updateLabelImage(this.label.name, this.labelFolderId, this.maskImage);

    }
}