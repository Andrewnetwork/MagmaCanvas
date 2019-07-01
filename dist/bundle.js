!function(t){var n={};function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:i})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(e.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(i,o,function(n){return t[n]}.bind(null,o));return i},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=0)}([function(t,n,e){"use strict";e.r(n);var i,o,r=(i=function(t,n){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])})(t,n)},function(t,n){function e(){this.constructor=t}i(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e)});!function(t){t[t.X=0]="X",t[t.Y=1]="Y"}(o||(o={}));var s=function(){return function(){}}(),u=function(){function t(){}return t.makeRect=function(t,n,e,i){return new a([{x:t,y:n},{x:t+e,y:n},{x:t+e,y:n+i},{x:t,y:n+i}])},t}(),a=function(t){function n(n,e){void 0===e&&(e="red");var i=t.call(this)||this;return i.points=n,i.fillColor=e,i}return r(n,t),n.prototype.draw=function(t){t.fillStyle=this.fillColor,t.beginPath(),t.moveTo(this.points[0].x,this.points[0].y);for(var n=0;n<this.points.length-1;n++)t.lineTo(this.points[n+1].x,this.points[n+1].y);t.fill()},n.prototype.splitBy=function(t){var e=this,i=this.points.map(function(n){return{x:n.x,y:t.findY(n.x)}}),r=this.points.map(function(n){return{x:t.findX(n.y),y:n.y}}),s=[];i.concat(r).forEach(function(t){e.has(t)&&(function(t,n){for(var e=0;e<t.length;e++)if(t[e].x==n.x&&t[e].y==n.y)return!0;return!1}(s,t)||s.push(t))});var u=this.pointsWith(o.Y,s[0].y),a=this.pointsWith(o.Y,s[1].y);return[new n([u[0],s[0],s[1],a[1]])]},n.prototype.pointsWith=function(t,n){var e=[];return this.points.forEach(function(i){n==(t==o.X?i.x:i.y)&&e.push(i)}),e},n.prototype.lineIntersects=function(t){return!0},n.prototype.has=function(t){var n=this.min(o.X)<=t.x&&t.x<=this.max(o.X),e=this.min(o.Y)<=t.y&&t.y<=this.max(o.Y);return n&&e},n.prototype.pointFunc=function(t,n,e){var i=t;return this.points.map(function(t){var r=n==o.X?t.x:t.y;e(i,r)&&(i=r)}),i},n.prototype.max=function(t){return this.pointFunc(0,t,function(t,n){return t<n})},n.prototype.min=function(t){return this.pointFunc(1/0,t,function(t,n){return n<=t})},n}(s),c=function(t){function n(n,e,i){void 0===i&&(i="blue");var o=t.call(this)||this;return o.fillColor=i,o.pos=n,o.radius=e,o}return r(n,t),n.prototype.draw=function(t){t.fillStyle=this.fillColor,t.beginPath(),t.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI,!0),t.fill()},n}(s),f=function(t){function n(n,e,i){void 0===i&&(i=!0);var o=t.call(this)||this;return o.start=n,o.end=e,o.extend=i,o}return r(n,t),n.prototype.draw=function(t){this.extend?(t.beginPath(),t.moveTo(this.findX(0),0),t.lineTo(this.findX(1e3),1e3),t.stroke()):(t.beginPath(),t.moveTo(this.start.x,this.start.y),t.lineTo(this.end.x,this.end.y),t.stroke())},n.prototype.slope=function(){return(this.end.y-this.start.y)/(this.end.x-this.start.x)},n.prototype.findX=function(t){return(t-this.start.y+this.slope()*this.start.x)/this.slope()},n.prototype.findY=function(t){return this.slope()*(t-this.start.x)+this.start.y},n}(s);var p=function(){function t(t,n,e){this.canvas=document.createElement("canvas"),this.canvas.setAttribute("width",String(n)),this.canvas.setAttribute("height",String(e)),this.canvas.setAttribute("id","canvas"),document.getElementById(t).appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.objects=[]}return t.prototype.add=function(t){return this.objects.push(t),this.render(),this.objects.length-1},t.prototype.addList=function(t){var n=this,e=[];return t.forEach(function(t){e.push(n.add(t))}),e},t.prototype.render=function(){var t=this;this.ctx.clearRect(0,0,1e3,1e3),this.objects.map(function(n){return n.draw(t.ctx)})},t.prototype.remove=function(t){delete this.objects[t]},t.prototype.removeList=function(t){var n=this;t.forEach(function(t){n.remove(t)})},t.prototype.clear=function(){this.objects=[]},t.prototype.addEventListener=function(t,n){this.canvas.addEventListener(t,n)},t}();function h(t,n){var e=t.getBoundingClientRect();return{x:n.clientX-e.left,y:n.clientY-e.top}}window.addEventListener("DOMContentLoaded",function(){var t=[],n=[],e=null,i=[],o=new p("canvasContainer",800,800),r=u.makeRect(o.canvas.width-600,o.canvas.height-600,400,400),s=o.add(r);o.addEventListener("click",function(e){var u=h(o.canvas,e);if(i.push(o.add(new c(u,10))),t.push(u),2==t.length){var a=new f(t[0],t[1]);o.add(a),n.push(a),t=[],o.removeList(i),o.remove(s),o.addList(r.splitBy(a))}}),o.addEventListener("mousemove",function(n){if(1==t.length){null!=e&&o.remove(e);var i=h(o.canvas,n);e=o.add(new f(t[0],i))}})})}]);