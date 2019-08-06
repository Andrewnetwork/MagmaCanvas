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
var Primitives_1 = require("../Primitives");
var Global_1 = require("../Global");
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid(width, height) {
        var _this = _super.call(this) || this;
        _this.width = width;
        _this.height = height;
        _this._gridSpaceIndex = 6;
        _this.gridSpaces = divisors(_this.width).slice(4, -4);
        _this._gridSpace = _this.gridSpaces[_this._gridSpaceIndex];
        _this.graphObjects = [];
        _this.graphFns = [];
        _this.plottedPoints = [];
        return _this;
    }
    Object.defineProperty(Grid.prototype, "gridSpace", {
        get: function () {
            return this._gridSpace;
        },
        set: function (newVal) {
            if (newVal != this._gridSpace) {
                this._gridSpace = newVal;
                this.make();
            }
        },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.draw = function (ctx) {
        var _this = this;
        this.graphObjects.forEach(function (obj) { return obj.draw(ctx); });
        this.plottedPoints.forEach(function (point) { return (new Primitives_1.Circle(_this.translatePoint(point), _this._gridSpace / 4, true, "black")).draw(ctx); });
        if (this.graphCanvas != null) {
            ctx.drawImage(this.graphCanvas, 0, 0);
        }
    };
    Grid.prototype.zoomIn = function () {
        var result = false;
        if (this.gridSpace != this.gridSpaces[this.gridSpaces.length - 1]) {
            this._gridSpaceIndex += 1;
            this.gridSpace = this.gridSpaces[this._gridSpaceIndex];
            result = true;
        }
        this.drawGraphs();
        return result;
    };
    Grid.prototype.zoomOut = function () {
        var result = false;
        if (this.gridSpace != this.gridSpaces[0]) {
            this._gridSpaceIndex -= 1;
            this.gridSpace = this.gridSpaces[this._gridSpaceIndex];
            result = true;
        }
        this.drawGraphs();
        return result;
    };
    Grid.prototype.attach = function (mCanvas, invokeRender) {
        var _this = this;
        this.mCanvas = mCanvas;
        this.mCanvas.canvas.addEventListener("wheel", function (ev) {
            if (ev.deltaY > 0) {
                _this.zoomIn();
            }
            else {
                _this.zoomOut();
            }
        });
        this.make();
        return null;
    };
    Grid.prototype.make = function () {
        var container = [];
        var a = Primitives_1.Shapes.makeRect(400, 0, 400, 400);
        a.color = "#E1D2DF";
        container.push(a);
        var b = Primitives_1.Shapes.makeRect(0, 0, 400, 400);
        b.color = "#F7E7EA";
        container.push(b);
        var c = Primitives_1.Shapes.makeRect(0, 400, 400, 400);
        c.color = "#E8F2E2";
        container.push(c);
        var d = Primitives_1.Shapes.makeRect(400, 400, 400, 400);
        d.color = "#F7FBEA";
        container.push(d);
        for (var i = this._gridSpace; i < this.width; i += this._gridSpace) {
            container.push(new Primitives_1.Line({ x: i, y: 0 }, { x: i, y: this.height }, 1, true, "rgba(0,0,0," + (this._gridSpaceIndex + 1) / this.gridSpaces.length + ")"));
        }
        for (var i = this._gridSpace; i < this.height; i += this._gridSpace) {
            container.push(new Primitives_1.Line({ x: 0, y: i }, { x: this.width, y: i }, 1, true, "rgba(0,0,0," + (this._gridSpaceIndex + 1) / this.gridSpaces.length + ")"));
        }
        container.push(new Primitives_1.Line({ x: 400, y: 0 }, { x: 400, y: 800 }, 3));
        container.push(new Primitives_1.Line({ x: 0, y: 400 }, { x: 800, y: 400 }, 3));
        this.graphObjects = container;
    };
    Grid.prototype.graph = function (fn) {
        this.graphFns.push(fn);
        this.drawGraphs();
    };
    Grid.prototype.plot = function (point) {
        this.plottedPoints.push(point);
    };
    Grid.prototype.plot_points = function (points) {
        var _this = this;
        points.forEach(function (point) { return _this.plot(point); });
    };
    Grid.prototype.clearGraphs = function () {
        this.graphFns = [];
        this.drawGraphs();
    };
    Grid.prototype.translatePoint = function (point) {
        var dx = this.mCanvas.canvas.width / 2;
        var dy = this.mCanvas.canvas.height / 2;
        return { x: point.x * this._gridSpace + dx, y: -point.y * this._gridSpace + dy };
    };
    Grid.prototype.drawGraphs = function () {
        var _this = this;
        this.graphCanvas = document.createElement('canvas');
        this.graphCanvas.width = this.mCanvas.canvas.width;
        this.graphCanvas.height = this.mCanvas.canvas.height;
        this.graphFns.forEach(function (fn) {
            var dx = _this.mCanvas.canvas.width / 2;
            var dy = _this.mCanvas.canvas.height / 2;
            var xInc = 0.01;
            var nSamples = 100;
            var points = [];
            for (var x = -nSamples; x <= nSamples; x += xInc) {
                points.push({ x: x * _this._gridSpace + dx, y: (-1 * fn(x)) * _this._gridSpace + dy });
            }
            var poly = new Primitives_1.Polygon(points, false, "blue");
            poly.draw(_this.graphCanvas.getContext("2d"));
        });
    };
    Grid.prototype.contains = function (point) {
        throw new Error("Method not implemented.");
    };
    return Grid;
}(Global_1.CanvasObject));
exports.Grid = Grid;
function divisors(n) {
    var div = [];
    for (var i = 1; i <= n / 2; i++) {
        if (n % i == 0 && (n / i) % 2 == 0) {
            div.push(i);
        }
    }
    return div;
}
