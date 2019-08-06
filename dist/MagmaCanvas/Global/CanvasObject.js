"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BoundingBox = (function () {
    function BoundingBox(upperLeft, width, height) {
        this.center = { x: upperLeft.x + (width / 2), y: upperLeft.y + (height / 2) };
        this.upperLeft = upperLeft;
        this.width = width;
        this.height = height;
    }
    BoundingBox.prototype.contains = function (point) {
        var xCont = point.x <= this.center.x + this.width / 2 && point.x >= this.center.x - this.width / 2;
        var yCont = point.y <= this.center.y + this.height / 2 && point.y >= this.center.y - this.height / 2;
        return xCont && yCont;
    };
    BoundingBox.prototype.overlaps = function (box) {
        var xCont = Math.abs(this.upperLeft.x - box.upperLeft.x) <= this.width + box.width;
        var yCont = Math.abs(this.upperLeft.y - box.upperLeft.y) <= this.height + box.height;
        return xCont && yCont;
    };
    return BoundingBox;
}());
exports.BoundingBox = BoundingBox;
var CanvasObject = (function () {
    function CanvasObject(center, boundingBox) {
        if (center === void 0) { center = { x: 0, y: 0 }; }
        if (boundingBox === void 0) { boundingBox = null; }
        this.boundingBox = boundingBox;
        this.center(center);
    }
    Object.defineProperty(CanvasObject.prototype, "area", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    CanvasObject.prototype.attach = function (mCanvas, invokeRender) {
        this.invokeRender = invokeRender;
        return null;
    };
    CanvasObject.prototype.center = function (center, callFunction) {
        if (callFunction === void 0) { callFunction = false; }
        if (center == null) {
            if (this._center.x == null) {
                this._centerPoint = this._center();
            }
            return this._centerPoint;
        }
        else {
            var prevCenter = this._centerPoint;
            if (center.x != null) {
                this._center = center;
                this._centerPoint = this._center;
            }
            else {
                if (callFunction) {
                    this._centerPoint = this._center(center);
                }
                else {
                    this._center = center;
                    return null;
                }
            }
            if (prevCenter != null && this.boundingBox != null) {
                var bbc = this.boundingBox.upperLeft;
                var x = bbc.x - (prevCenter.x - this._centerPoint.x);
                var y = bbc.y - (prevCenter.y - this._centerPoint.y);
                this.boundingBox.upperLeft = { x: x, y: y };
            }
            return this._centerPoint;
        }
    };
    return CanvasObject;
}());
exports.CanvasObject = CanvasObject;
