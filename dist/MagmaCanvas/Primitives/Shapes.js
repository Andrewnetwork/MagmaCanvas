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
var Helpers_1 = require("../Helpers");
var Global_1 = require("../Global");
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
}(Global_1.Drawable));
exports.Diagram = Diagram;
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(upperLeft, width, height) {
        var _this = _super.call(this) || this;
        _this.upperLeft = upperLeft;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Rectangle.prototype.draw = function (ctx) {
        throw new Error("Method not implemented.");
    };
    return Rectangle;
}(Global_1.Drawable));
exports.Rectangle = Rectangle;
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon(points, fill, color) {
        if (fill === void 0) { fill = true; }
        if (color === void 0) { color = "red"; }
        var _this = _super.call(this) || this;
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
            if (line.isOn(point)) {
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
}(Global_1.Drawable));
exports.Polygon = Polygon;
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(center, radius, fill, color) {
        if (fill === void 0) { fill = true; }
        if (color === void 0) { color = "blue"; }
        var _this = _super.call(this, center) || this;
        _this.color = color;
        _this.radius = radius;
        _this.fill = fill;
        _this.boundingBox = new Rectangle({ x: _this.center().x - radius, y: _this.center().y - radius }, radius * 2, radius * 2);
        return _this;
    }
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
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(start, end, lineWidth, extend, strokeStyle) {
        if (lineWidth === void 0) { lineWidth = 1; }
        if (extend === void 0) { extend = false; }
        if (strokeStyle === void 0) { strokeStyle = "black"; }
        var _this = _super.call(this) || this;
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
    Line.prototype.isOn = function (point) {
        return this.findY(point.x) == point.y;
    };
    Line.prototype.pointOfIntersection = function (line) {
        var xIntersection = (line.findY(0) - this.findY(0)) / (this.slope() - line.slope());
        var yIntersection = line.findY(xIntersection);
        return { x: xIntersection, y: yIntersection };
    };
    return Line;
}(Global_1.Drawable));
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
