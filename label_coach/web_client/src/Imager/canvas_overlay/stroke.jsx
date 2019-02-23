export default class Stroke {
    constructor(overlay, viewer, id, cursorColor, radius = null, labelFolderId = null, updateStrokes = null) {
        this.path = [];
        this.overlay = overlay;
        this.viewer = viewer;
        this.canvas = overlay.fabricCanvas();
        this.cursorColor = cursorColor;
        this.radius = radius;
        this.updateStrokes = updateStrokes;
        this.id = id;
        this.maskImage = this.maskify();
        this.labelFolderId = labelFolderId;
        this.mousecursor = new fabric.Circle({
                                                 left: -100,
                                                 top: -100,
                                                 radius: radius / 2,
                                                 fill: this.cursorColor,
                                                 stroke: "black",
                                                 originX: 'center',
                                                 originY: 'center'
                                             });
        this.canvas.add(this.mousecursor);

    }

    static hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    maskify() {
        let ctx = this.canvas.getContext();
        let srcImg = this.canvas.getContext()
                         .getImageData(0, 0, this.canvas.width, this.canvas.height);
        let dstImg = ctx.createImageData(srcImg);
        let dstData = dstImg.data;
        let srcData = srcImg.data;
        let strokeColor = Stroke.hexToRgb(this.cursorColor);
        console.log(strokeColor);
        for (let i = 0, maxI = srcData.length; i < maxI; i += 4) {
            if (srcData[i] === strokeColor.r &&
                srcData[i + 1] === strokeColor.g &&
                srcData[i + 2] === strokeColor.b &&
                srcData[i + 3] === 255) {
                //white
                dstData[i] = dstData[i + 1] = dstData[i + 2] = 255;
            } else {
                //black
                dstData[i] = dstData[i + 1] = dstData[i + 2] = 0;
            }
            //no transparency
            dstData[i + 3] = 255
        }

        return dstImg
    }

    activate() {
        this.canvas.freeDrawingBrush.color = this.cursorColor;
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
            this.maskImage = this.maskify();


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
                                                         fill: this.cursorColor,
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
        })
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
    }
}