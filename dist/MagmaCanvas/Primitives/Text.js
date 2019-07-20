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
var Interfaces_1 = require("../Global/Interfaces");
var Text = (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Text.prototype.contains = function (point) {
        throw new Error("Method not implemented.");
    };
    Text.prototype.attach = function (mCanvas) {
        throw new Error("Method not implemented.");
        return null;
    };
    Text.prototype.draw = function (ctx) {
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText("Hello", this.center().x, this.center().y);
    };
    return Text;
}(Interfaces_1.CanvasObject));
exports.Text = Text;
