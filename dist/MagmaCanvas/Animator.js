"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Animator = (function () {
    function Animator() {
        this.frames = [];
        this.nRepeat = 0;
        this.loopFrames = [];
        this.isLooping = false;
    }
    Animator.prototype.addFrame = function (transCondition, action) {
        if (this.isLooping) {
            this.loopFrames.push({ transCondition: transCondition, action: action });
        }
        else {
            this.frames.push({ transCondition: transCondition, action: action });
        }
    };
    Animator.prototype.start = function (msTick) {
        var _this = this;
        if (msTick === void 0) { msTick = 0; }
        this.intervalHandler = window.setInterval(function () {
            if (_this.frames.length != 0) {
                if (!_this.frames[0].transCondition()) {
                    _this.frames[0].action();
                }
                else {
                    _this.frames.shift();
                }
            }
            else {
                clearInterval(_this.intervalHandler);
            }
        }, msTick);
    };
    Animator.prototype.stop = function () {
        clearInterval(this.intervalHandler);
    };
    Animator.prototype.startLoop = function (nRepeat) {
        this.nRepeat = nRepeat;
        this.isLooping = true;
    };
    Animator.prototype.endLoop = function () {
        var rp = Array(this.nRepeat).fill(this.loopFrames).reduce(function (p, c) { return p.concat(c); });
        this.frames = this.frames.concat(rp);
        this.isLooping = false;
    };
    return Animator;
}());
exports.Animator = Animator;
