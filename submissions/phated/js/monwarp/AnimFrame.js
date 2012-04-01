
define(['dojo/_base/declare'], function(declare) {
  return declare('AnimFrame', null, {
    endTime: 0,
    imgSlotX: 0,
    imgSlotY: 0,
    image: null,
    constructor: function(args) {
      return declare.safeMixin(this, args);
    }
  });
});
