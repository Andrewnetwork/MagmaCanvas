"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shapes_1 = require("./Shapes");
var MagmaCanvas = (function () {
    function MagmaCanvas(containerID, width, height, history, cursor) {
        var _this = this;
        if (history === void 0) { history = false; }
        if (cursor === void 0) { cursor = true; }
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", String(width));
        this.canvas.setAttribute("height", String(height));
        this.canvas.setAttribute("id", "canvas");
        document.getElementById(containerID).appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.objects = [];
        if (cursor) {
            this.cursorImage = new Shapes_1.Diagram("cursor.png", { x: 0, y: 0 });
            this.addEventListener("mousemove", function (_, pos) {
                if (_this.cursorImage != null) {
                    _this.cursorImage.loc = { x: pos.x - 5, y: pos.y - 4 };
                }
            });
            this.canvas.addEventListener("mouseleave", function () {
                _this.cursorImage = null;
            });
            this.canvas.addEventListener("mouseenter", function () {
                _this.cursorImage = new Shapes_1.Diagram("cursor.png", { x: 0, y: 0 });
            });
        }
        else {
            this.cursorImage = null;
        }
        setInterval(function () { return _this.render(); }, 0);
    }
    MagmaCanvas.prototype.add = function (obj) {
        this.objects.push(obj);
        var objectID = this.objects.length - 1;
        return objectID;
    };
    MagmaCanvas.prototype.addList = function (objs) {
        var _this = this;
        var ids = [];
        objs.forEach(function (obj) {
            ids.push(_this.add(obj));
        });
        return ids;
    };
    MagmaCanvas.prototype.paintList = function (objs) {
        var _this = this;
        objs.forEach(function (obj) {
            obj.draw(_this.ctx);
        });
    };
    MagmaCanvas.prototype.paint = function (obj) {
        obj.draw(this.ctx);
    };
    MagmaCanvas.prototype.render = function () {
        var _this = this;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.objects.forEach(function (obj) { return obj.draw(_this.ctx); });
        if (this.cursorImage != null) {
            this.cursorImage.draw(this.ctx);
        }
    };
    MagmaCanvas.prototype.remove = function (id) {
        delete this.objects[id];
    };
    MagmaCanvas.prototype.removeList = function (ids) {
        var _this = this;
        ids.forEach(function (id) {
            _this.remove(id);
        });
    };
    MagmaCanvas.prototype.clear = function () {
        this.objects = [];
    };
    MagmaCanvas.prototype.move = function (objHandler, deltas) {
        if (this.objects[objHandler] instanceof Shapes_1.Polygon) {
            this.objects[objHandler].points.forEach(function (point) {
                point.x += deltas.x;
                point.y += deltas.y;
            });
        }
    };
    MagmaCanvas.prototype.get = function (objectHandler) {
        return this.objects[objectHandler];
    };
    MagmaCanvas.prototype.addEventListener = function (event, listener) {
        var _this = this;
        this.canvas.addEventListener(event, function (e) {
            var pos = getMousePos(_this.canvas, e);
            listener(e, pos);
        });
    };
    return MagmaCanvas;
}());
exports.MagmaCanvas = MagmaCanvas;
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
