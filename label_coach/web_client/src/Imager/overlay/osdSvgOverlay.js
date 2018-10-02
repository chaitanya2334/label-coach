// OpenSeadragon SVG Overlay plugin 0.0.5

(function () {

    var $ = window.OpenSeadragon;

    if (!$) {
        $ = require('openseadragon');
        if (!$) {
            throw new Error('OpenSeadragon is missing.');
        }
    }

    var svgNS = 'http://www.w3.org/2000/svg';

    // ----------
    $.Viewer.prototype.svgOverlay = function () {
        if (this._svgOverlayInfo) {
            return this._svgOverlayInfo;
        }

        this._svgOverlayInfo = new Overlay(this);
        return this._svgOverlayInfo;
    };

    // ----------
    var Overlay = function (viewer) {
        var self = this;

        this._viewer = viewer;
        this._containerWidth = 0;
        this._containerHeight = 0;

        this._svg = document.createElementNS(svgNS, 'svg');
        this._svg.style.position = 'absolute';
        this._svg.style.left = 0;
        this._svg.style.top = 0;
        this._svg.style.width = '100%';
        this._svg.style.height = '100%';
        this._viewer.canvas.appendChild(this._svg);

        this.nodes = [];
        this.createNode();
        this.createNode();

        this._viewer.addHandler('animation', function () {
            self.resize();
        });

        this._viewer.addHandler('open', function () {
            self.resize();
        });

        this._viewer.addHandler('rotate', function (evt) {
            self.resize();
        });

        this._viewer.addHandler('resize', function () {
            self.resize();
        });

        this.resize();
    };

    // ----------
    Overlay.prototype = {
        // ----------
        node: function(){

        },
        createNode: function () {
            let _node = document.createElementNS(svgNS, 'g');
            this._svg.appendChild(_node);
            this.nodes.push(_node);
            return _node;
        },
        getNode: function (i) {
            return this.nodes[i];
        },

        svg: function () {
            return this._svg;
        },

        // ----------
        resize: function () {
            if (this._containerWidth !== this._viewer.container.clientWidth) {
                this._containerWidth = this._viewer.container.clientWidth;
                this._svg.setAttribute('width', this._containerWidth);
            }

            if (this._containerHeight !== this._viewer.container.clientHeight) {
                this._containerHeight = this._viewer.container.clientHeight;
                this._svg.setAttribute('height', this._containerHeight);
            }

            var p = this._viewer.viewport.pixelFromPoint(new $.Point(0, 0), true);
            var zoom = this._viewer.viewport.getZoom(true);
            var rotation = this._viewer.viewport.getRotation();
            // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private
            // variable.
            var scale = this._viewer.viewport._containerInnerSize.x * zoom;
            this.nodes.forEach((v, i) => {
                                   v.setAttribute('transform',
                                                  'translate(' + p.x + ',' + p.y + ') scale(' + scale + ') rotate(' + rotation + ')');
                               }
            )

        },

        // ----------
        onClick: function (node, handler) {
            // TODO: Fast click for mobile browsers

            new $.MouseTracker({
                                   element: node,
                                   clickHandler: handler
                               }).setTracking(true);
        }
    };

})();