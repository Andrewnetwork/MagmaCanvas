"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var List = (function () {
    function List(arry) {
        if (arry === void 0) { arry = []; }
        this.arry = arry;
    }
    List.prototype.push = function (elm) {
        this.arry.push(elm);
    };
    List.prototype.delete = function (idx) {
        this.arry = this.arry.slice(0, idx).concat(this.arry.slice(idx + 1, this.arry.length));
    };
    Object.defineProperty(List.prototype, "length", {
        get: function () {
            return this.arry.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "i", {
        get: function () {
            return this.arry;
        },
        enumerable: true,
        configurable: true
    });
    return List;
}());
exports.List = List;
