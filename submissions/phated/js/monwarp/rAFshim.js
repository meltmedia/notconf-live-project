
/*
http://paulirish.com/2011/requestanimationframe-for-smart-animating/
http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

requestAnimationFrame polyfill by Erik M�ller
fixes from Paul Irish and Tino Zijdel

Coffeescript and AMD by Blaine Bublitz
*/

(function() {

  define([], function() {
    var lastTime, vendor, vendors, _i, _len, _ref;
    lastTime = 0;
    vendors = ["ms", "moz", "webkit", "o"];
    for (_i = 0, _len = vendors.length; _i < _len; _i++) {
      vendor = vendors[_i];
      if (window.requestAnimationFrame) break;
      window.requestAnimationFrame = window["" + vendor + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window["" + vendor + "CancelAnimationFrame"] || window["" + vendor + "CancelRequestAnimationFrame"];
    }
    if (window.requestAnimationFrame == null) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = setTimeout((function() {
          return callback(currTime + timeToCall);
        }), timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    return (_ref = window.cancelAnimationFrame) != null ? _ref : window.cancelAnimationFrame = clearTimeout;
  });

}).call(this);
