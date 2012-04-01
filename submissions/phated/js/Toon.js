define(['dojo/_base/declare', 'mwe/box2d/RectangleEntity'], function(declare, RectangleEntity) {
  return declare('Toon', [RectangleEntity], {
    constructor: function(args) {
      declare.safeMixin(this, args);
    },
    draw: function(ctx) {
      ctx.save();
      ctx.translate(this.x * this.box.scale, this.y * this.box.scale);
      ctx.rotate(this.angle);
      ctx.translate(-this.x * this.box.scale, -this.y * this.box.scale);
      ctx.drawImage(this.img, (this.x - this.halfWidth) * this.box.scale, (this.y - this.halfHeight) * this.box.scale, (this.halfWidth * 2) * this.box.scale, (this.halfHeight * 2) * this.box.scale);
      ctx.restore();
    }
  });
});