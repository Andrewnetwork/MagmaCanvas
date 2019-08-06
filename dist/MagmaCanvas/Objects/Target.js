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
var Primitives_1 = require("../Primitives");
var Target = (function (_super) {
    __extends(Target, _super);
    function Target(center, boundingBox, nRings, ringSize) {
        if (center === void 0) { center = { x: 0, y: 0 }; }
        if (boundingBox === void 0) { boundingBox = null; }
        if (nRings === void 0) { nRings = 10; }
        if (ringSize === void 0) { ringSize = 10; }
        var _this = _super.call(this, center, boundingBox) || this;
        _this.objs = [];
        _this.targetRings = [];
        for (var i = nRings; i >= 1; i--) {
            _this.targetRings.push(new Primitives_1.Circle(center, i * ringSize, true, "rgb(" + i * 5 + "," + i * 10 + "," + i * 30 + ")"));
        }
        _this.radius = nRings * ringSize;
        return _this;
    }
    Object.defineProperty(Target.prototype, "area", {
        get: function () {
            return this.targetRings[0].area;
        },
        enumerable: true,
        configurable: true
    });
    Target.prototype.contains = function (point) {
        return this.targetRings[0].contains(point);
    };
    Target.prototype.score = function (point) {
        for (var i = this.targetRings.length - 1; i >= 0; i--) {
            if (this.targetRings[i].contains(point)) {
                return (i + 1) / this.targetRings.length;
            }
        }
        return 0;
    };
    Target.prototype.draw = function (ctx) {
        this.targetRings.forEach(function (ring) { return ring.draw(ctx); });
        this.objs.forEach(function (obj) { return obj.draw(ctx); });
    };
    Target.prototype.center = function (center, callFunction) {
        var centerPoint = _super.prototype.center.call(this, center, callFunction);
        if (center != null && this.targetRings != null) {
            this.targetRings.forEach(function (ring) { return ring.center(centerPoint); });
        }
        return centerPoint;
    };
    Target.prototype.add = function (obj) {
        var _this = this;
        var x = obj.center().x - this.center().x;
        var y = obj.center().y - this.center().y;
        var psn = function () { return { x: _this.center().x + x, y: _this.center().y + y }; };
        obj.center(psn, false);
        this.objs.push(obj);
    };
    return Target;
}(Global_1.CanvasObject));
exports.Target = Target;
