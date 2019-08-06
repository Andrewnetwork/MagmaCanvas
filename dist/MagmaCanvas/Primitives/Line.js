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
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(start, end, lineWidth, extend, strokeStyle) {
        if (lineWidth === void 0) { lineWidth = 1; }
        if (extend === void 0) { extend = false; }
        if (strokeStyle === void 0) { strokeStyle = "black"; }
        var _this = _super.call(this, { x: Math.abs(start.x - end.x), y: Math.abs(start.y - end.y) }) || this;
        _this.start = start;
        _this.end = end;
        _this.extend = extend;
        _this.lineWidth = lineWidth;
        _this.strokeStyle = strokeStyle;
        return _this;
    }
    Line.prototype.draw = function (ctx) {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        if (this.extend) {
            ctx.beginPath();
            var slope = this.slope();
            if (slope == 0) {
                ctx.moveTo(0, this.start.y);
                ctx.lineTo(1000, this.end.y);
            }
            else if (slope == Infinity || slope == -Infinity) {
                ctx.moveTo(this.start.x, 0);
                ctx.lineTo(this.end.x, 1000);
            }
            else {
                ctx.moveTo(this.findX(0), 0);
                ctx.lineTo(this.findX(1000), 1000);
            }
            ctx.stroke();
        }
        else {
            ctx.beginPath();
            ctx.moveTo(this.start.x, this.start.y);
            ctx.lineTo(this.end.x, this.end.y);
            ctx.stroke();
        }
    };
    Line.prototype.slope = function () {
        return (this.end.y - this.start.y) / (this.end.x - this.start.x);
    };
    Line.prototype.findX = function (yVal) {
        return (yVal - this.start.y + this.slope() * this.start.x) / this.slope();
    };
    Line.prototype.findY = function (xVal) {
        return this.slope() * (xVal - this.start.x) + this.start.y;
    };
    Line.prototype.orthLine = function (point, lineWidth, extend, strokeStyle) {
        if (lineWidth === void 0) { lineWidth = 1; }
        if (extend === void 0) { extend = false; }
        if (strokeStyle === void 0) { strokeStyle = "black"; }
        var orthSlope = -1 / this.slope();
        var newY = 0;
        var newX = 0;
        if (orthSlope == 0) {
            newX = 0;
            newY = point.y;
        }
        else if (orthSlope == Infinity || orthSlope == -Infinity) {
            newX = point.x;
            newY = 0;
        }
        else {
            newY = (-1 / this.slope()) * point.x + this.findY(0);
            newX = (newY - point.y + orthSlope * point.x) / orthSlope;
        }
        return new Line({ x: newX, y: newY }, point, lineWidth, extend, strokeStyle);
    };
    Line.prototype.contains = function (point) {
        var m = this.slope();
        var b = this.findY(0);
        return Math.abs(b + m * point.x - point.y) / Math.sqrt(1 + Math.pow(m, 2)) <= this.lineWidth;
    };
    Line.prototype.pointOfIntersection = function (line) {
        var xIntersection = (line.findY(0) - this.findY(0)) / (this.slope() - line.slope());
        var yIntersection = line.findY(xIntersection);
        return { x: xIntersection, y: yIntersection };
    };
    return Line;
}(Global_1.CanvasObject));
exports.Line = Line;
