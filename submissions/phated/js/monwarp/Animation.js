
define(['dojo/_base/declare', 'mwe/AnimFrame'], function(declare, AnimFrame) {
  return declare('Animation', null, {
    currFrameIndex: 0,
    animTime: 0,
    totalDuration: 0,
    height: 64,
    width: 64,
    image: null,
    constructor: function(args) {
      declare.safeMixin(this, args);
      return this.start();
    },
    addFrame: function(duration, imageSlotX, imageSlotY) {
      if (!this.frames) this.frames = [];
      this.totalDuration += duration;
      return this.frames.push(new AnimFrame({
        endTime: this.totalDuration,
        image: this.image,
        imgSlotX: imageSlotX,
        imgSlotY: imageSlotY
      }));
    },
    start: function() {
      this.animTime = 0;
      return this.currFrameIndex = 0;
    },
    update: function(elapsedTime) {
      var _results;
      if (this.frames.length > 1) {
        this.animTime += elapsedTime;
        if (this.animTime >= this.totalDuration) {
          this.animTime = this.animTime % this.totalDuration;
          this.currFrameIndex = 0;
        }
        _results = [];
        while (this.animTime > this.frames[this.currFrameIndex].endTime) {
          _results.push(this.currFrameIndex++);
        }
        return _results;
      }
    },
    getCurrentFrame: function() {
      if (this.frames.length === 0) return null;
      return this.frames[this.currFrameIndex];
    }
  });
});
