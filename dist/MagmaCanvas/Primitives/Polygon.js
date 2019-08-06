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
var Line_1 = require("./Line");
var Helpers_1 = require("../Helpers");
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon(points, fill, color) {
        if (fill === void 0) { fill = true; }
        if (color === void 0) { color = "red"; }
        var _this = _super.call(this, polygon_center(points)) || this;
        _this.points = points;
        _this.color = color;
        _this.fill = fill;
        return _this;
    }
    Polygon.prototype.draw = function (ctx) {
        ctx.beginPath();
        if (this.points[0] != null) {
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 0; i < this.points.length - 1; i++) {
                if (this.points[i + 1] != null) {
                    ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
                }
            }
            if (this.fill) {
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            else {
                ctx.strokeStyle = this.color;
                ctx.stroke();
            }
        }
    };
    Polygon.prototype.splitBy = function (line) {
        var _this = this;
        var a = this.points.map(function (point) { return ({ x: point.x, y: line.findY(point.x) }); });
        var b = this.points.map(function (point) { return ({ x: line.findX(point.y), y: point.y }); });
        var boundaryPoints = [];
        a.concat(b).forEach(function (point) {
            if (_this.has(point)) {
                if (!includes(boundaryPoints, point)) {
                    boundaryPoints.push(point);
                }
            }
        });
        var cutLine = new Line_1.Line(boundaryPoints[0], boundaryPoints[1]);
        var abovePoints = [];
        var belowPoints = [];
        this.points.forEach(function (point) {
            if (point.y > cutLine.findY(point.x)) {
                abovePoints.push(point);
            }
            else {
                belowPoints.push(point);
            }
        });
        var topOut = euclideanWalk(boundaryPoints.concat(abovePoints));
        var bottomOut = euclideanWalk(boundaryPoints.concat(belowPoints));
        return [new Polygon(topOut), new Polygon(bottomOut)];
    };
    Polygon.prototype.pointsWith = function (axis, val) {
        var ls = [];
        this.points.forEach(function (point) {
            if (val == (axis == Global_1.Axis.X ? point.x : point.y)) {
                ls.push(point);
            }
        });
        ls.sort(function (a, b) {
            if (axis == Global_1.Axis.X) {
                return b.y - a.y;
            }
            else {
                return b.x - a.x;
            }
        });
        return ls;
    };
    Polygon.prototype.reflectOver = function (line) {
        var _a = this.splitBy(line), a = _a[0], b = _a[1];
        a.color = "blue";
        a.points = a.points.map(function (point) {
            if (line.contains(point)) {
                return point;
            }
            else {
                if (Math.abs(line.slope()) < 1) {
                    var lineY = line.findY(point.x);
                    var newY = 0;
                    if (lineY > point.y) {
                        newY = point.y + (lineY - point.y) * 2;
                    }
                    else {
                        newY = point.y - (point.y - lineY) * 2;
                    }
                    return { x: line.orthLine(point).findX(newY), y: newY };
                }
                else {
                    var lineX = line.findX(point.y);
                    var newX = 0;
                    if (lineX > point.x) {
                        newX = point.x + (lineX - point.x) * 2;
                    }
                    else {
                        newX = point.x - (point.x - lineX) * 2;
                    }
                    return { x: newX, y: line.orthLine(point).findY(newX) };
                }
            }
        });
        return [a, b];
    };
    Polygon.prototype.has = function (targ) {
        var xBounds = this.min(Global_1.Axis.X) <= targ.x && targ.x <= this.max(Global_1.Axis.X);
        var yBounds = this.min(Global_1.Axis.Y) <= targ.y && targ.y <= this.max(Global_1.Axis.Y);
        return xBounds && yBounds;
    };
    Polygon.prototype.pointFunc = function (startVal, axis, fun) {
        var val = startVal;
        this.points.map(function (point) {
            var curVal = axis == Global_1.Axis.X ? point.x : point.y;
            if (fun(val, curVal)) {
                val = curVal;
            }
        });
        return val;
    };
    Polygon.prototype.max = function (axis) {
        return this.pointFunc(0, axis, function (a, b) { return a < b; });
    };
    Polygon.prototype.min = function (axis) {
        return this.pointFunc(Infinity, axis, function (a, b) { return b <= a; });
    };
    Polygon.prototype.contains = function (point) {
        throw new Error("Method not implemented.");
    };
    return Polygon;
}(Global_1.CanvasObject));
exports.Polygon = Polygon;
function polygon_center(points) {
    if (points != null) {
        var ySum_1 = 0;
        var xSum_1 = 0;
        var n = points.length;
        points.map(function (point) {
            xSum_1 += point.x;
            ySum_1 += point.y;
        });
        return { x: xSum_1 / n, y: ySum_1 / n };
    }
    else {
        return { x: 0, y: 0 };
    }
}
function includes(points, target) {
    for (var i = 0; i < points.length; i++) {
        if (points[i].x == target.x && points[i].y == target.y) {
            return true;
        }
    }
    return false;
}
exports.includes = includes;
function euclideanDist(p1, p2) {
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
}
function euclideanWalk(pts) {
    var points = new Helpers_1.List(pts);
    var walk = [points.i[0]];
    var currPoint = points.i[0];
    points.delete(0);
    while (currPoint != null) {
        var minDist = Infinity;
        var minPointIdx = null;
        for (var i = 0; i < points.length; i++) {
            var dist = euclideanDist(currPoint, points.i[i]);
            if (dist < minDist) {
                minDist = dist;
                minPointIdx = i;
            }
        }
        if (minPointIdx != null) {
            currPoint = points.i[minPointIdx];
            points.delete(minPointIdx);
            walk.push(currPoint);
        }
        else {
            currPoint = null;
        }
    }
    return walk;
}
exports.euclideanWalk = euclideanWalk;
