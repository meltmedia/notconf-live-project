
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

  define(['dojo/_base/declare', 'dojo/_base/lang', 'scripts/thirdparty/Box2d.min.js'], function(declare, lang) {
    return declare('Entity', null, {
      id: 0,
      x: 0,
      y: 0,
      angle: 0,
      center: 0,
      restitution: 0.3,
      density: 1.0,
      friction: 0.9,
      linearDamping: 0,
      angularDamping: 0,
      staticBody: false,
      color: 'rgba(128,128,128,0.5)',
      strokeStyle: '#000000',
      hidden: false,
      box: null,
      constructor: function(args) {
        return declare.safeMixin(this, args);
      },
      update: function(state) {
        if (state) return lang.mixin(this, state);
      },
      draw: function(ctx) {
        ctx.fillStyle = this.strokeStyle;
        ctx.beginPath();
        ctx.arc(this.x * SCALE, this.y * SCALE, 4, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.center.x * SCALE, this.center.y * SCALE, 2, 0, Math.PI * 2, true);
        ctx.closePath();
        return ctx.fill();
      },
      build: function(def) {
        if (def.radius) return new CircleEntity(def);
        if (def.points) return new PolygonEntity(def);
        if (def.img) return new ImageEntity(def);
        return new RectangleEntity(def);
      }
    });
  });

}).call(this);
