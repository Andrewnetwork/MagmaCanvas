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
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(center, radius, fill, color) {
        if (fill === void 0) { fill = true; }
        if (color === void 0) { color = "blue"; }
        var _this = _super.call(this, center) || this;
        _this.color = color;
        _this.radius = radius;
        _this.fill = fill;
        _this.boundingBox = new Global_1.BoundingBox({ x: _this.center().x - radius - 10, y: _this.center().y - radius - 10 }, radius * 2 + 15, radius * 2 + 15);
        return _this;
    }
    Object.defineProperty(Circle.prototype, "area", {
        get: function () {
            return Math.PI * (Math.pow(this.radius, 2));
        },
        enumerable: true,
        configurable: true
    });
    Circle.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.center().x, this.center().y, this.radius, 0, Math.PI * 2, true);
        if (this.fill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        else {
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    };
    Circle.prototype.attach = function (mCanvas, invokeRender) {
        var refs = [];
        this.invokeRender = invokeRender;
        return { refs: refs };
    };
    Circle.prototype.contains = function (point) {
        var center = this._center;
        if (this.center instanceof Function) {
            center = this.center();
        }
        return Math.sqrt(Math.pow((point.y - center.y), 2) + Math.pow((point.x - center.x), 2)) <= this.radius;
    };
    return Circle;
}(Global_1.CanvasObject));
exports.Circle = Circle;
