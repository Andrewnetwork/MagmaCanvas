"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Primitives_1 = require("./Primitives");
var Global_1 = require("./Global");
var MagmaCanvas = (function () {
    function MagmaCanvas(containerID, width, height, history, cursor) {
        var _this = this;
        if (history === void 0) { history = false; }
        if (cursor === void 0) { cursor = true; }
        this.canvas = createCanvas(containerID, width, height);
        this.layers = [createCanvas(containerID, width, height)];
        this.layersObjects = [new Array()];
        this.canvas.style.boxShadow = "10px 10px 5px grey";
        this.canvas.style.cursor = "none";
        document.getElementById(containerID).appendChild(this.canvas);
        document.getElementById(containerID).appendChild(this.layers[0]);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.objects = [];
        this.renderQueue = [];
        if (cursor) {
            this.cursorImage = new Primitives_1.Diagram("cursor.png", { x: 0, y: 0 });
            this.addEventListener("mousemove", function (_, pos) {
                if (_this.cursorImage != null) {
                    _this.cursorImage.loc = { x: pos.x - 5, y: pos.y - 4 };
                }
            });
            this.canvas.addEventListener("mouseleave", function () {
                _this.cursorImage = null;
            });
            this.canvas.addEventListener("mouseenter", function () {
                _this.cursorImage = new Primitives_1.Diagram("cursor.png", { x: 0, y: 0 });
            });
        }
        else {
            this.cursorImage = null;
        }
        window.requestAnimationFrame(function () { return _this.render(); });
    }
    MagmaCanvas.prototype.add = function (obj, layer) {
        var _this = this;
        if (layer === void 0) { layer = null; }
        if (layer == null) {
            this.objects.push(obj);
            var objectID_1 = this.objects.length - 1;
            this.renderQueue.push(objectID_1);
            if (obj instanceof Global_1.CanvasObject) {
                obj.attach(this, function () { return _this.invokeRender(objectID_1); });
            }
            return objectID_1;
        }
        else {
            this.layersObjects[layer].push(obj);
            var objectID = this.layersObjects[layer].length - 1;
            obj.draw(this.layers[0].getContext("2d"));
            return objectID;
        }
    };
    MagmaCanvas.prototype.invokeRender = function (objectID) {
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
        this.ctx.clearRect(0, 0, this.canvas.width * 2, this.canvas.height * 2);
        this.objects.forEach(function (obj) {
            obj.draw(_this.ctx);
        });
        if (this.cursorImage != null) {
            this.cursorImage.draw(this.ctx);
        }
        window.requestAnimationFrame(function () { return _this.render(); });
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
        if (this.objects[objHandler] instanceof Primitives_1.Polygon) {
            this.objects[objHandler].points.forEach(function (point) {
                point.x += deltas.x;
                point.y += deltas.y;
            });
        }
    };
    MagmaCanvas.prototype.get = function (objectHandler) {
        return this.objects[objectHandler];
    };
    MagmaCanvas.prototype.addEventListener = function (event, listener, objID) {
        var _this = this;
        if (objID === void 0) { objID = null; }
        this.canvas.addEventListener(event, function (e) {
            var pos = getMousePos(_this.canvas, e);
            if (objID != null) {
                if (_this.objects[objID].contains(pos)) {
                    listener(e, pos);
                }
            }
            else {
                listener(e, pos);
            }
        });
    };
    return MagmaCanvas;
}());
exports.MagmaCanvas = MagmaCanvas;
var zIndexCounter = 10;
function createCanvas(containerID, width, height) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", String(window.devicePixelRatio * width));
    canvas.setAttribute("height", String(window.devicePixelRatio * height));
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.position = "absolute";
    canvas.style.border = "solid black";
    canvas.style.zIndex = zIndexCounter.toString();
    canvas.style.left = ((window.innerWidth - width) / 2) + "px";
    zIndexCounter--;
    return canvas;
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
