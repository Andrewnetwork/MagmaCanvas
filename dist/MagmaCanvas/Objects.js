"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shapes_1 = require("./Shapes");
var Grid = (function () {
    function Grid(width, height) {
        this.width = width;
        this.height = height;
        this._gridSpaceIndex = 6;
        this.gridSpaces = divisors(this.width).slice(4, -4);
        this._gridSpace = this.gridSpaces[this._gridSpaceIndex];
    }
    Object.defineProperty(Grid.prototype, "gridSpace", {
        get: function () {
            return this._gridSpace;
        },
        set: function (newVal) {
            if (newVal != this._gridSpace) {
                this._gridSpace = newVal;
                this.mCanvas.removeList(this.shapeHandlers);
                this.make();
            }
        },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.attach = function (mCanvas) {
        var _this = this;
        this.mCanvas = mCanvas;
        this.mCanvas.canvas.addEventListener("wheel", function (ev) {
            if (ev.deltaY > 0) {
                if (_this.gridSpace != _this.gridSpaces[_this.gridSpaces.length - 1]) {
                    _this._gridSpaceIndex += 1;
                    _this.gridSpace = _this.gridSpaces[_this._gridSpaceIndex];
                    console.log(_this.gridSpace);
                }
            }
            else {
                if (_this.gridSpace != _this.gridSpaces[0]) {
                    _this._gridSpaceIndex -= 1;
                    _this.gridSpace = _this.gridSpaces[_this._gridSpaceIndex];
                }
            }
        });
        this.make();
    };
    Grid.prototype.make = function () {
        var container = [];
        var a = Shapes_1.Shapes.makeRect(400, 0, 400, 400);
        a.fillColor = "#E1D2DF";
        container.push(a);
        var b = Shapes_1.Shapes.makeRect(0, 0, 400, 400);
        b.fillColor = "#F7E7EA";
        container.push(b);
        var c = Shapes_1.Shapes.makeRect(0, 400, 400, 400);
        c.fillColor = "#E8F2E2";
        container.push(c);
        var d = Shapes_1.Shapes.makeRect(400, 400, 400, 400);
        d.fillColor = "#F7FBEA";
        container.push(d);
        for (var i = this._gridSpace; i < this.width; i += this._gridSpace) {
            container.push(new Shapes_1.Line({ x: i, y: 0 }, { x: i, y: this.height }));
        }
        for (var i = this._gridSpace; i < this.height; i += this._gridSpace) {
            container.push(new Shapes_1.Line({ x: 0, y: i }, { x: this.width, y: i }));
        }
        container.push(new Shapes_1.Line({ x: 400, y: 0 }, { x: 400, y: 800 }, 3));
        container.push(new Shapes_1.Line({ x: 0, y: 400 }, { x: 800, y: 400 }, 3));
        this.shapeHandlers = this.mCanvas.addList(container);
    };
    return Grid;
}());
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
