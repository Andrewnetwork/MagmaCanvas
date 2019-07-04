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
var List_1 = require("./Helpers/List");
var Axis;
(function (Axis) {
    Axis[Axis["X"] = 0] = "X";
    Axis[Axis["Y"] = 1] = "Y";
})(Axis = exports.Axis || (exports.Axis = {}));
var Drawable = (function () {
    function Drawable() {
    }
    return Drawable;
}());
exports.Drawable = Drawable;
var Shapes = (function () {
    function Shapes() {
    }
    Shapes.makeRect = function (x, y, w, h) {
        return new Polygon([{ x: x, y: y }, { x: x + w, y: y }, { x: x + w, y: y + h }, { x: x, y: y + h }]);
    };
    return Shapes;
}());
exports.Shapes = Shapes;
var Diagram = (function (_super) {
    __extends(Diagram, _super);
    function Diagram(src, loc) {
        var _this = _super.call(this) || this;
        _this.img = new Image();
        _this.img.src = src;
        _this.loc = loc;
        return _this;
    }
    Diagram.prototype.draw = function (ctx) {
        ctx.drawImage(this.img, this.loc.x, this.loc.y);
    };
    return Diagram;
}(Drawable));
exports.Diagram = Diagram;
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon(points, fillColor) {
        if (fillColor === void 0) { fillColor = "red"; }
        var _this = _super.call(this) || this;
        _this.points = points;
        _this.fillColor = fillColor;
        return _this;
    }
    Polygon.prototype.draw = function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        if (this.points[0] != null) {
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 0; i < this.points.length - 1; i++) {
                if (this.points[i + 1] != null) {
                    ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
                }
            }
            ctx.fill();
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
        var cutLine = new Line(boundaryPoints[0], boundaryPoints[1]);
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
    Polygon.validPolygon = function (points) {
    };
    Polygon.prototype.pointsWith = function (axis, val) {
        var ls = [];
        this.points.forEach(function (point) {
            if (val == (axis == Axis.X ? point.x : point.y)) {
                ls.push(point);
            }
        });
        ls.sort(function (a, b) {
            if (axis == Axis.X) {
                return b.y - a.y;
            }
            else {
                return b.x - a.x;
            }
        });
        return ls;
    };
    Polygon.prototype.lineIntersects = function (line) {
        return true;
    };
    Polygon.prototype.has = function (targ) {
        var xBounds = this.min(Axis.X) <= targ.x && targ.x <= this.max(Axis.X);
        var yBounds = this.min(Axis.Y) <= targ.y && targ.y <= this.max(Axis.Y);
        return xBounds && yBounds;
    };
    Polygon.prototype.pointFunc = function (startVal, axis, fun) {
        var val = startVal;
        this.points.map(function (point) {
            var curVal = axis == Axis.X ? point.x : point.y;
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
    Polygon.prototype.center = function () {
        var ySum = 0;
        var xSum = 0;
        var n = this.points.length;
        this.points.map(function (point) {
            xSum += point.x;
            ySum += point.y;
        });
        return { x: xSum / n, y: ySum / n };
    };
    return Polygon;
}(Drawable));
exports.Polygon = Polygon;
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(pos, radius, fillColor) {
        if (fillColor === void 0) { fillColor = "blue"; }
        var _this = _super.call(this) || this;
        _this.fillColor = fillColor;
        _this.pos = pos;
        _this.radius = radius;
        return _this;
    }
    Circle.prototype.draw = function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
    };
    return Circle;
}(Drawable));
exports.Circle = Circle;
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(start, end, lineWidth, extend) {
        if (lineWidth === void 0) { lineWidth = 1; }
        if (extend === void 0) { extend = false; }
        var _this = _super.call(this) || this;
        _this.start = start;
        _this.end = end;
        _this.extend = extend;
        _this.lineWidth = lineWidth;
        return _this;
    }
    Line.prototype.draw = function (ctx) {
        ctx.lineWidth = this.lineWidth;
        if (this.extend) {
            ctx.beginPath();
            ctx.moveTo(this.findX(0), 0);
            ctx.lineTo(this.findX(1000), 1000);
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
    return Line;
}(Drawable));
exports.Line = Line;
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
    var points = new List_1.List(pts);
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
