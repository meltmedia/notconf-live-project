
/*

Copyright 2011 Luis Montes (http://azprogrammer.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function() {

  define(['dojo/_base/declare', 'mwe/box2d/Entity', 'scripts/thirdparty/Box2d.min.js'], function(declare, Entity) {
    return declare('PolygonEntity', Entity, {
      points: null,
      constructor: function(args) {
        declare.safeMixin(this, args);
        if (!this.points) return this.points = [];
      },
      draw: function(ctx) {
        var point, _i, _len, _ref;
        ctx.save();
        ctx.translate(this.x * SCALE, this.y * SCALE);
        ctx.rotate(this.angle);
        ctx.translate(-this.x * SCALE, -this.y * SCALE);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.strokeStyle;
        ctx.beginPath();
        ctx.moveTo((this.x + this.points[0].x) * SCALE, (this.y + this.points[0].y) * SCALE);
        _ref = this.points;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          point = _ref[_i];
          ctx.lineTo((point.x + this.x) * SCALE, (point.y + this.y) * SCALE);
        }
        ctx.lineTo((this.x + this.points[0].x) * SCALE, (this.y + this.points[0].y) * SCALE);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        return this.inherited(arguments);
      }
    });
  });

}).call(this);
