
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

  define(['dojo/_base/declare', 'dojo/dom', 'dojo/on', 'dojo/dom-style'], function(declare, dom, bind, domStyle) {
    return declare('DNDFileController', null, {
      node: null,
      borderStyle: null,
      borderDropStyle: '3px dashed red',
      constructor: function(args) {
        declare.safeMixin(this, args);
        if (this.node == null) this.node = dom.byId(this.id);
        bind(this.node, 'dragenter', this.dragenter);
        bind(this.node, 'dragover', this.dragover);
        bind(this.node, 'dragleave', this.dragleave);
        bind(this.node, 'drop', this.preDrop);
        return this.borderStyle = domStyle.get(this.node, 'border');
      },
      dragenter: function(event) {
        event.stopPropagation();
        event.preventDefault();
        return domStyle.set(this.node, 'border', this.borderDropStyle);
      },
      dragover: function(event) {
        event.stopPropagation();
        return event.preventDefault();
      },
      dragleave: function(event) {
        event.stopPropagation();
        event.preventDefault();
        return domStyle.set(this.node, 'border', this.borderStyle);
      },
      preDrop: function(event) {
        domStyle.set(this.node, 'border', this.borderStyle);
        event.stopPropagation();
        event.preventDefault();
        return this.drop(event);
      },
      drop: function(event) {
        var file, files, reader, _i, _len;
        try {
          files = event.dataTransfer.files;
          for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            reader = new FileReader();
            console.log("File: " + file);
            reader.onerror = function(evt) {
              return console.log("Error code: " + evt.target.error.code);
            };
            reader.onload = (function(aFile) {
              return function(evt) {
                if (evt.target.readyState === FileReader.DONE) {
                  return console.log("base64 length: " + evt.target.result.length);
                }
              };
            })(file);
            reader.readAsDataURL(file);
          }
          return false;
        } catch (dropE) {
          return console.log("DnD Error: " + dropE);
        }
      }
    });
  });

}).call(this);
