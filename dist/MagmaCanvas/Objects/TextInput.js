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
var TextInput = (function (_super) {
    __extends(TextInput, _super);
    function TextInput(active, center) {
        if (active === void 0) { active = false; }
        if (center === void 0) { center = { x: 0, y: 0 }; }
        var _this = _super.call(this, center) || this;
        _this.active = active;
        _this.width = 400;
        _this.height = 60;
        _this.counter = 0;
        _this.showCursor = false;
        _this.value = "";
        return _this;
    }
    TextInput.prototype.contains = function (point) {
        return true;
    };
    TextInput.prototype.draw = function (ctx) {
        if (this.counter >= 40 && this.active) {
            this.counter = 0;
            this.showCursor = !this.showCursor;
        }
        ctx.beginPath();
        ctx.rect(this.center().x - this.width / 2, this.center().y - this.height / 2, this.width, this.height);
        if (this.showCursor) {
            ctx.fillStyle = "#f2f2f2";
        }
        else {
            ctx.fillStyle = "white";
        }
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(167,167,167)";
        ctx.stroke();
        ctx.closePath();
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(this.value, this.center().x - (this.value.length * 18) / 2, this.center().y + this.height / 4);
        this.counter++;
    };
    TextInput.prototype.attach = function (mCanvas) {
        var _this = this;
        mCanvas.addEventListener("click", function (e, pos) {
            var xBounds = pos.x > _this.center().x - _this.width / 2 && pos.x < _this.center().x + _this.width / 2;
            var yBounds = pos.y > _this.center().y - _this.height / 2 && pos.y < _this.center().y + _this.height / 2;
            if (xBounds && yBounds) {
                _this.active = true;
            }
            else {
                _this.active = false;
                _this.showCursor = false;
                _this.counter = 0;
            }
        });
        window.addEventListener("keydown", function (ev) {
            if (_this.active) {
                if (ev.key.match(/[0-9]|[a-z]|[A-Z]| |/g) != null && ev.key.length == 1) {
                    _this.value += ev.key;
                }
                else if (ev.keyCode == 8) {
                    _this.value = _this.value.slice(0, -1);
                }
                console.log(ev.keyCode);
            }
        });
        var refs = [];
        return { refs: refs };
    };
    return TextInput;
}(Global_1.CanvasObject));
exports.TextInput = TextInput;
