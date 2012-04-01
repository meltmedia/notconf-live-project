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
define(['dojo/_base/declare', 'dojo/_base/window', 'dojo/dom', 'dojo/dom-construct', 'mwe/rAFshim'], function(declare, win, dom, domConstruct) {
  return declare('GameCore', null, {
    statics: {
      FONT_SIZE: 24
    },
    isRunning: false,
    maxStep: 40,
    resourceManager: null,
    inputManager: null,
    canvasManager: null,
    constructor: function(args) {
      return declare.safeMixin(this, args);
    },
    stop: function() {
      return this.isRunning = false;
    },
    run: function() {
      if (this.isRunning) return;
      this.loadResources(this.canvasManager.canvas);
      this.initInput(this.inputManager);
      this.launchLoop();
      return this.isRunning = true;
    },
    loadResources: function(canvas) {},
    init: function() {
      /* TODO: Put this somewhere...
      unless @inputManager
        @inputManager = new InputManager { canvas: @canvas }
      
      @initInput @inputManager
      */
    },
    initInput: function(inputManager) {},
    handleInput: function(inputManager, elapsedTime) {},
    gameLoop: function() {
      this.currTime = Date.now();
      this.elapsedTime = Math.min(this.currTime - this.prevTime, this.maxStep);
      this.prevTime = this.currTime;
      if ((this.resourceManager != null) && !this.resourceManager.resourcesReady()) {
        this.updateLoadingScreen(this.elapsedTime);
        return this.canvasManager.drawLoadingScreen(this.canvasManager.context, this.resourceManager);
      } else {
        if (!this.paused) this.update(this.elapsedTime);
        this.canvasManager.context.save();
        this.canvasManager.draw(this.canvasManager.context);
        return this.canvasManager.context.restore();
      }
    },
    launchLoop: function() {
      var animloop,
        _this = this;
      this.currTime = Date.now();
      this.elapsedTime = 0;
      this.prevTime = this.currTime;
      animloop = function() {
        _this.gameLoop();
        return window.requestAnimationFrame(animloop, document);
      };
      return animloop();
    },
    update: function(elapsedTime) {},
    updateLoadingScreen: function(elapsedTime) {}
  });
});
