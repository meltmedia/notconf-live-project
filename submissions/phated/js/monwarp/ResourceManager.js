
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

  define(['dojo/_base/declare'], function(declare) {
    return declare('ResourceManager', null, {
      imageDir: null,
      imgList: [],
      constructor: function(args) {
        return declare.safeMixin(this, args);
      },
      loadImage: function(filename, width, height) {
        var image, img, _i, _len, _ref;
        if (this.imageDir != null) filename = this.imageDir + filename;
        _ref = this.imgList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          image = _ref[_i];
          if (image.name === filename) return image.img;
        }
        img = new Image();
        img.onerror = function() {
          return alert('missing file');
        };
        img.src = filename;
        this.imgList.push({
          name: filename,
          img: img
        });
        return img;
      },
      loadFiles: function(files) {
        var file, id, imgs;
        imgs = {};
        for (id in files) {
          file = files[id];
          imgs[id] = this.loadImage(file);
        }
        return imgs;
      },
      resourcesReady: function() {
        var image, _i, _len, _ref;
        _ref = this.imgList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          image = _ref[_i];
          if (!image.img.complete) return false;
        }
        return true;
      },
      getPercentComplete: function() {
        var image, numComplete, _i, _j, _len, _len2, _ref, _ref2;
        _ref = this.imgList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          image = _ref[_i];
          if (image.img.error) return 0;
        }
        if (this.imgList.length === 0) return 100.0;
        numComplete = 0.0;
        _ref2 = this.imgList;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          image = _ref2[_j];
          if (image.img.complete) numComplete += 1.0;
        }
        return Math.round(numComplete / this.imgList.length * 100.0);
      }
    });
  });

}).call(this);
