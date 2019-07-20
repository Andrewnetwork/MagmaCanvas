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
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(label, _onClick, center) {
        if (center === void 0) { center = { x: 0, y: 0 }; }
        var _this = _super.call(this, center) || this;
        _this._onClick = _onClick;
        _this.label = label;
        _this.height = 60;
        _this.width = _this.label.length * 30;
        return _this;
    }
    Button.prototype.draw = function (ctx) {
        var grd = ctx.createLinearGradient(this.center().x - this.width / 2, this.center().y - this.height / 2, this.center().x - this.width / 2, this.center().y + this.height / 2);
        grd.addColorStop(0, "rgb(246,246,246)");
        grd.addColorStop(1, "rgb(222,222,222)");
        ctx.beginPath();
        ctx.rect(this.center().x - this.width / 2, this.center().y - this.height / 2, this.width, this.height);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(167,167,167)";
        ctx.stroke();
        ctx.closePath();
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(this.label, this.center().x - (this.label.length * 18) / 2, this.center().y + this.height / 4);
    };
    Button.prototype.contains = function (point) {
        return true;
    };
    Button.prototype.attach = function (mCanvas) {
        var _this = this;
        mCanvas.addEventListener("click", function (e, pos) {
            var xBounds = pos.x > _this.center().x - _this.width / 2 && pos.x < _this.center().x + _this.width / 2;
            var yBounds = pos.y > _this.center().y - _this.height / 2 && pos.y < _this.center().y + _this.height / 2;
            if (xBounds && yBounds) {
                _this._onClick();
            }
        });
        var refs = [];
        return { refs: refs };
    };
    return Button;
}(Global_1.CanvasObject));
exports.Button = Button;
