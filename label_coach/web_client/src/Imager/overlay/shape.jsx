export default class Shape {
    constructor(overlay, viewer){
        this.overlay = overlay;
        this.viewer = viewer;
        let onSglClick = this.onClick.bind(this);
        let onDblClick = this.onDblClick.bind(this);
        this.viewer.addHandler('canvas-click', this.makeDoubleClick(onDblClick, onSglClick, 200));
    }

    onClick(event){
        // The canvas-click event gives us a position in web coordinates.
        let webPoint = event.position;

        // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
        let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);

        // Convert from viewport coordinates to image coordinates.
        let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
    }

    onDblClick(event){
        // The canvas-click event gives us a position in web coordinates.
        let webPoint = event.position;

        // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
        let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);

        // Convert from viewport coordinates to image coordinates.
        let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
    }

    makeDoubleClick(doubleClickCallback, singleClickCallback, timeout) {
        let clicks = 0;
        return function () {
            clicks++;
            if (clicks === 1) {
                singleClickCallback && singleClickCallback.apply(this, arguments);
                timeout = setTimeout(function () {
                    clicks = 0;
                }, timeout);
            } else {
                timeout && clearTimeout(timeout);
                doubleClickCallback && doubleClickCallback.apply(this, arguments);
                clicks = 0;
            }
        };
    }
}