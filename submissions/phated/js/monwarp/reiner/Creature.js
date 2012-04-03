/*
This type of sprite is based off of the excellent images from Reiner's tilesets: http://www.reinerstilesets.de/

creatures have walking, idle, and dying animations in 8 isometric directions
The animations directions are in E,N,NE,NW,S,SE,SW,W (alphabetical) order simply because that's
how i stitched them together using ImageMagick.
*/
define(['dojo/_base/declare', 'mwe/Sprite', 'mwe/Animation'], function(declare, Sprite, Animation) {
  return declare('Creature', Sprite, {
    statics: {
      EAST: 0,
      NORTH: 1,
      NORTHEAST: 2,
      NORTHWEST: 3,
      SOUTH: 4,
      SOUTHEAST: 5,
      SOUTHWEST: 6,
      WEST: 7,
      STATE_WALKING: 0,
      STATE_DYING: 1,
      STATE_IDLE: 2
    },
    state: 0,
    walkingAnims: [],
    dyingAnims: [],
    idleAnims: [],
    direction: 5,
    constructor: function(args) {
      this.state = this.statics.STATE_IDLE;
      this.direction = this.statics.SOUTH;
      return declare.safeMixin(this, args);
    },
    update: function(elapsedTime) {
      this.x += this.dx * elapsedTime;
      this.y += this.dy * elapsedTime;
      if (this.state !== this.statics.STATE_DYING) {
        if (this.dx > 0 && this.dy === 0) {
          this.direction = this.statics.EAST;
        } else if (this.dx === 0 && this.dy < 0) {
          this.direction = this.statics.NORTH;
        } else if (this.dx > 0 && this.dy < 0) {
          this.direction = this.statics.NORTHEAST;
        } else if (this.dx < 0 && this.dy < 0) {
          this.direction = this.statics.NORTHWEST;
        } else if (this.dx === 0 && this.dy > 0) {
          this.direction = this.statics.SOUTH;
        } else if (this.dx > 0 && this.dy > 0) {
          this.direction = this.statics.SOUTHEAST;
        } else if (this.dx < 0 && this.dy > 0) {
          this.direction = this.statics.SOUTHWEST;
        } else if (this.dx < 0 && this.dy === 0) {
          this.direction = this.statics.WEST;
        }
        if (this.dx === 0 && this.dy === 0) {
          this.state = this.statics.STATE_IDLE;
        } else {
          this.state = this.statics.STATE_WALKING;
        }
      }
      if (this.state === this.statics.STATE_WALKING) {
        this.anim = this.walkingAnims[this.direction];
      } else if (this.state === this.statics.STATE_DYING) {
        this.anim = this.dyingAnims[this.direction];
      } else {
        this.anim = this.idleAnims[this.direction];
      }
      return this.anim.update(elapsedTime);
    },
    createAnimations: function(frameCount, frameTimes, img, h, w, ySlot) {
      var anims, currentFrameTime, i, isFTArray, j, _ref;
      anims = [];
      isFTArray = Array.isArray(frameTimes);
      currentFrameTime = 1;
      if (!ySlot) ySlot = 0;
      for (i = 0; i <= 7; i++) {
        anims[i] = new Animation({
          height: h,
          width: w,
          image: img
        });
        for (j = 0, _ref = frameCount - 1; 0 <= _ref ? j <= _ref : j >= _ref; 0 <= _ref ? j++ : j--) {
          if (isFTArray) {
            currentFrameTime = frameTimes[j];
          } else {
            currentFrameTime = frameTimes;
          }
          anims[i].addFrame(currentFrameTime, j + frameCount * i, ySlot);
        }
      }
      return anims;
    }
    /* Contra's version
    createAnimations: (frameCount, frameTimes, img, h, w, ySlot=0) ->
      anims = []
      currentFrameTime = 1
      for i in [0..7]
        anims[i] = new Animation
          height: h
          width: w
          image: img
        for j, item in Array(frameTime-1)
          currentFrameTime = (if Array.isArray frameTimes then frameTimes[j] else frameTimes)
          anims[i].addFrame currentFrameTime, (j + frameCount * i), ySlot
      return anims
    */
  });
});
