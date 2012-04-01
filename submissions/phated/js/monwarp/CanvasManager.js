
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

(function() {

  define(['dojo/_base/declare', 'dojo/_base/window', 'dojo/dom', 'dojo/dom-construct', 'dojo/domReady!'], function(declare, win, dom, domConstruct) {
    return declare('CanvasManager', null, {
      canvasId: 'canvas',
      contextType: '2d',
      canvas: null,
      context: null,
      height: null,
      width: null,
      loadingForeground: '#00F',
      loadingBackground: '#FFF',
      constructor: function(args) {
        declare.safeMixin(this, args);
        this.setCanvas();
        this.setHeight();
        return this.setWidth();
      },
      setCanvas: function() {
        var _ref;
        this.canvas = dom.byId((_ref = this.canvasId) != null ? _ref : domConstruct.place('<canvas>', win.body()));
        if (!this.canvas) {
          return alert('Sorry, your browser does not support canvas.  I recommend any browser but Internet Explorer');
        }
        this.context = this.canvas.getContext(this.contextType);
        if (!this.context) {
          return alert("Sorry, your browser does not support a " + this.contextType + " drawing surface on canvas.  I recommend any browser but Internet Explorer");
        }
      },
      setHeight: function(height) {
        var _ref;
        if (height != null) this.height = height;
        if (this.height < 0) return;
        return this.canvas.height = (_ref = this.height) != null ? _ref : this.height = this.canvas.height;
      },
      setWidth: function(width) {
        var _ref;
        if (width != null) this.width = width;
        if (this.width < 0) return;
        return this.canvas.width = (_ref = this.width) != null ? _ref : this.width = this.canvas.width;
      },
      draw: function(context) {
        if (this.contextType === '2d') {
          context.font = '14px sans-serif';
          return context.fillText('This game does not have its own draw function!', 10, 50);
        }
      },
      drawLoadingScreen: function(context, resourceManager) {
        var textPxSize;
        if (this.contextType === '2d') {
          context.fillStyle = this.loadingBackground;
          context.fillRect(0, 0, this.width, this.height);
          context.fillStyle = this.loadingForeground;
          context.strokeStyle = this.loadingForeground;
          textPxSize = Math.floor(this.height / 12);
          context.font = "bold " + textPxSize + "px sans-serif";
          context.fillText("Loading... " + (resourceManager.getPercentComplete()) + "%", this.width * 0.1, this.height * 0.55);
          context.strokeRect(this.width * 0.1, this.height * 0.7, this.width * 0.8, this.height * 0.1);
          context.fillRect(this.width * 0.1, this.height * 0.7, this.width * 0.8 * resourceManager.getPercentComplete() / 100, this.height * 0.1);
          return context.lineWidth = 4;
        }
      }
    });
  });

}).call(this);
