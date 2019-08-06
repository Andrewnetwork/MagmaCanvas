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
var Diagram = (function (_super) {
    __extends(Diagram, _super);
    function Diagram(src, loc) {
        var _this = _super.call(this, loc, new Global_1.BoundingBox(loc, 0, 0)) || this;
        _this.img = new Image();
        _this.img.src = src;
        _this.loc = loc;
        return _this;
    }
    Diagram.prototype.draw = function (ctx) {
        ctx.drawImage(this.img, this.loc.x, this.loc.y);
    };
    Diagram.prototype.contains = function (point) {
        throw new Error("Method not implemented.");
    };
    return Diagram;
}(Global_1.CanvasObject));
exports.Diagram = Diagram;
