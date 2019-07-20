"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("../Global");
var LinearLayout = (function (_super) {
    __extends(LinearLayout, _super);
    function LinearLayout() {
        var _this = _super.call(this, null) || this;
        _this.canvasObjects = [];
        _this.mCanvas = null;
        _this.counter = 300;
        return _this;
    }
    LinearLayout.prototype.contains = function (point) {
        throw new Error("Method not implemented.");
    };
    LinearLayout.prototype.attach = function (mCanvas) {
        this.mCanvas = mCanvas;
        return null;
    };
    LinearLayout.prototype.draw = function (ctx) {
    };
    LinearLayout.prototype.add = function (obj) {
        this.canvasObjects.push(obj);
        obj.center({ x: this.counter, y: 200 });
        this.mCanvas.add(obj);
        this.counter += 300;
        return this;
    };
    return LinearLayout;
}(Global_1.CanvasObject));
exports.LinearLayout = LinearLayout;
