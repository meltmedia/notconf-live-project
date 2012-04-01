/*

Copyright 2011 Luis Montes

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
var _this = this;

define(['dojo/_base/declare', 'dojo/on', 'dojo/dom-geometry', 'dojo/_base/lang', 'mwe/GameAction'], function(declare, bind, domGeom, lang, GameAction) {
  return declare('InputManager', null, {
    keyActions: [],
    mouseAction: null,
    touchAction: null,
    canvasManager: null,
    box: null,
    constructor: function(args) {
      return declare.safeMixin(this, args);
    },
    bind: function(target, eventTarget) {
      return bind(target, eventTarget, this[eventTarget]);
    },
    mapToKey: function(gameAction, keyCode) {
      if (!this.keyActions) this.keyActions = [];
      return this.keyActions[keyCode] = gameAction;
    },
    addKeyAction: function(keyCode, initialPressOnly) {
      var ga;
      ga = new GameAction;
      if (initialPressOnly) ga.behavior = ga.statics.DETECT_INITIAL_PRESS_ONLY;
      return this.mapToKey(ga, keyCode);
    },
    bindMouse: function() {
      bind(this.canvasManager.canvas, 'mousedown', lang.hitch(this, this.mouseDown));
      bind(document, 'mouseup', lang.hitch(this, this.mouseUp));
      return bind(this.canvasManager.canvas, 'mousemove', lang.hitch(this, this.mouseMove));
    },
    bindTouch: function() {
      bind(this.canvasManager.canvas, 'touchstart', this.touchStart);
      bind(document, 'touchend', this.touchEnd);
      return bind(this.canvasManager.canvas, 'touchmove', this.touchMove);
    },
    bindKeys: function() {
      bind(document, 'keydown', lang.hitch(this, this.keyPressed));
      return bind(document, 'keyup', lang.hitch(this, this.keyReleased));
    },
    setMouseAction: function(gameAction) {
      return this.mouseAction = gameAction;
    },
    setTouchAction: function(gameAction) {
      return this.touchAction = gameAction;
    },
    mouseUp: function(event) {},
    mouseDown: function(event) {},
    mouseMove: function(event) {},
    touchStart: function(event) {},
    touchEnd: function(event) {},
    touchMove: function(event) {},
    getKeyAction: function(event) {
      if (this.keyActions.length) return this.keyActions[event.keyCode];
      return null;
    },
    keyPressed: function(event) {
      var gameAction;
      gameAction = this.getKeyAction(event);
      if ((gameAction != null) && !gameAction.isPressed()) {
        return gameAction.press();
      }
    },
    keyReleased: function(event) {
      var gameAction;
      gameAction = this.getKeyAction(event);
      if (gameAction != null) return gameAction.release();
    },
    keyTyped: function(event) {},
    getMouseLoc: function(event) {
      var coordsM;
      coordsM = domGeom.position(this.canvasManager.canvas);
      if (this.box == null) {
        return {
          x: Math.round(event.clientX - coordsM.x),
          y: Math.round(event.clientY - coordsM.y)
        };
      }
      return {
        x: (event.clientX - coordsM.x) / this.box.scale,
        y: (event.clientY - coordsM.y) / this.box.scale
      };
    }
  });
});
