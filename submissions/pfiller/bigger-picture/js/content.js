(function() {
  var get_resize_dimensions, images, slide, slideshow, ss;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  get_resize_dimensions = function(w, h, tw, th) {
    var scale;
    if (tw > w || th > h) {
      scale = tw / w < th / h ? tw / w : th / h;
      return {
        w: Math.floor(w * scale),
        h: Math.floor(h * scale)
      };
    } else {
      return {
        w: w,
        h: h
      };
    }
  };
  slide = (function() {
    slide.prototype.pending_show = null;
    slide.prototype.loaded = false;
    slide.prototype.lw = -1;
    slide.prototype.lh = -1;
    function slide(src, caption, id) {
      this.src = src;
      this.caption = caption;
      this.id = id;
      this.create_image();
    }
    slide.prototype.create_image = function() {
      this.img = new Image();
      this.img.onload = __bind(function(evt) {
        return this.image_loaded();
      }, this);
      return this.img.src = this.src;
    };
    slide.prototype.image_loaded = function() {
      this.loaded = true;
      this.width = this.img.width;
      this.height = this.img.height;
      if (this.pending_show) {
        return this.show_slide(this.pending_show.h, this.pending_show.w);
      }
    };
    slide.prototype.show_slide = function(h, w) {
      if (!this.loaded) {
        return this.pending_show = {
          h: h,
          w: w
        };
      } else {
        if (!this.element || this.lh !== h || this.lw !== w) {
          this.build_element(h, w);
        }
        return this.element.fadeIn("fast");
      }
    };
    slide.prototype.hide_slide = function() {
      return this.element.fadeOut("fast");
    };
    slide.prototype.build_element = function(h, w) {
      var new_wh;
      if (!this.element) {
        this.element = $("#" + this.id);
      }
      this.lh = h;
      this.lw = w;
      new_wh = get_resize_dimensions(this.width, this.height, this.lw, this.lh);
      this.img = $("<img />", {
        src: this.src,
        width: new_wh.w,
        height: new_wh.h
      });
      return this.element.html(this.img);
    };
    return slide;
  })();
  slideshow = (function() {
    slideshow.prototype.slides = [];
    slideshow.prototype.current_index = 0;
    slideshow.prototype.ul = $("<ul />", {
      id: "slideshow"
    });
    function slideshow(images) {
      var image, _i, _len;
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        image = images[_i];
        this.set_up_image(image);
      }
      $("body").append(this.ul);
      this.set_up_listeners();
      this.show_current();
    }
    slideshow.prototype.set_up_image = function(image) {
      var caption, id, src;
      image = $(image);
      src = image.find(".bpImage").first().prop("src");
      caption = image.find(".bpCaption");
      caption.find(".photoNum").remove();
      caption.find(".cf, a").remove();
      caption = caption.text();
      id = "slide-" + this.slides.length;
      this.ul.append($("<li >", {
        id: id
      }));
      return this.slides.push(new slide(src, caption, id));
    };
    slideshow.prototype.show_current = function() {
      return this.slides[this.current_index].show_slide($(window).height(), $(window).width());
    };
    slideshow.prototype.hide_current = function() {
      return this.slides[this.current_index].hide_slide();
    };
    slideshow.prototype.set_up_listeners = function() {
      return $("body").on("keydown", __bind(function(evt) {
        return this.test_keypress(evt);
      }, this));
    };
    slideshow.prototype.test_keypress = function(evt) {
      var kc, to;
      kc = evt.keyCode;
      to = -9999;
      if ((kc === 39 || kc === 40)) {
        to = this.current_index < this.slides.length - 1 ? this.current_index + 1 : 0;
      } else if ((kc === 37 || kc === 38)) {
        to = this.current_index > 0 ? this.current_index - 1 : this.slides.length - 1;
      }
      if (to >= 0) {
        evt.preventDefault();
        this.hide_current();
        this.current_index = to;
        return this.show_current();
      }
    };
    return slideshow;
  })();
  images = $(".bpImageTop, .bpBoth");
  $("body").html("");
  ss = new slideshow(images);
}).call(this);
