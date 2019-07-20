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
var Shapes_1 = require("./Shapes");
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
        this.graphObjects.forEach(function (obj) {
            obj.draw(ctx);
        });
        ctx.drawImage(this.graphCanvas, 0, 0);
    };
    Grid.prototype.attach = function (mCanvas) {
        var _this = this;
        this.mCanvas = mCanvas;
        this.mCanvas.canvas.addEventListener("wheel", function (ev) {
            if (ev.deltaY > 0) {
                if (_this.gridSpace != _this.gridSpaces[_this.gridSpaces.length - 1]) {
                    _this._gridSpaceIndex += 1;
                    _this.gridSpace = _this.gridSpaces[_this._gridSpaceIndex];
                }
            }
            else {
                if (_this.gridSpace != _this.gridSpaces[0]) {
                    _this._gridSpaceIndex -= 1;
                    _this.gridSpace = _this.gridSpaces[_this._gridSpaceIndex];
                }
            }
            _this.drawGraphs();
        });
        this.make();
        this.mCanvas.add(this);
    };
    Grid.prototype.make = function () {
        var container = [];
        var a = Shapes_1.Shapes.makeRect(400, 0, 400, 400);
        a.color = "#E1D2DF";
        container.push(a);
        var b = Shapes_1.Shapes.makeRect(0, 0, 400, 400);
        b.color = "#F7E7EA";
        container.push(b);
        var c = Shapes_1.Shapes.makeRect(0, 400, 400, 400);
        c.color = "#E8F2E2";
        container.push(c);
        var d = Shapes_1.Shapes.makeRect(400, 400, 400, 400);
        d.color = "#F7FBEA";
        container.push(d);
        for (var i = this._gridSpace; i < this.width; i += this._gridSpace) {
            container.push(new Shapes_1.Line({ x: i, y: 0 }, { x: i, y: this.height }));
        }
        for (var i = this._gridSpace; i < this.height; i += this._gridSpace) {
            container.push(new Shapes_1.Line({ x: 0, y: i }, { x: this.width, y: i }));
        }
        container.push(new Shapes_1.Line({ x: 400, y: 0 }, { x: 400, y: 800 }, 3));
        container.push(new Shapes_1.Line({ x: 0, y: 400 }, { x: 800, y: 400 }, 3));
        this.graphObjects = container;
    };
    Grid.prototype.graph = function (fn) {
        this.graphFns.push(fn);
        this.drawGraphs();
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
            var poly = new Shapes_1.Polygon(points, false, "blue");
            poly.draw(_this.graphCanvas.getContext("2d"));
        });
    };
    return Grid;
}(Shapes_1.Drawable));
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
