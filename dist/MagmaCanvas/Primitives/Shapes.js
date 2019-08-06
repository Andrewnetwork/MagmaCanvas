"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Polygon_1 = require("./Polygon");
var Shapes = (function () {
    function Shapes() {
    }
    Shapes.makeRect = function (x, y, w, h) {
        return new Polygon_1.Polygon([{ x: x, y: y }, { x: x + w, y: y }, { x: x + w, y: y + h }, { x: x, y: y + h }]);
    };
    return Shapes;
}());
exports.Shapes = Shapes;
