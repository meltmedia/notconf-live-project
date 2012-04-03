define(['dojo/dom', 'dojo/dom-geometry', 'mwe/GameCore', 'mwe/ResourceManager', 'mwe/CanvasManager', 'mwe/InputManager', 'mwe/box2d/Box', 'mwe/box2d/CircleEntity', 'mwe/box2d/RectangleEntity', 'mwe/box2d/PolygonEntity', './Toon', 'scripts/thirdparty/stats.js', 'scripts/thirdparty/Box2d.min.js'], function(dom, domGeom, GameCore, ResourceManager, CanvasManager, InputManager, Box, CircleEntity, RectangleEntity, PolygonEntity, Toon, Stats) {
  var SCALE, box, cm, debug, game, geomId, getCollidedSprite, im, images, intersect, millisToMarsh, millisToMarshPassed, rm, showHidden, solids, stats, world;
  debug = (typeof localStorage !== "undefined" && localStorage !== null) && localStorage.debug === 'y' ? true : false;
  SCALE = 30.0;
  geomId = 0;
  var sounds = {};
  showHidden = false;
  stats = new Stats();
  stats.getDomElement().style.position = 'absolute';
  stats.getDomElement().style.right = '0px';
  stats.getDomElement().style.bottom = '0px';
  world = {};
  solids = [{"id":31,"x":0,"y":0,"points":[{"x":0.23333333333333334,"y":14.533333333333333},{"x":5.5,"y":12.2},{"x":11.533333333333333,"y":14.566666666666666}],"staticBody":true,"hidden":true,"center":{"x":0,"y":0},"_inherited":{"p":1},"selected":false},{"id":32,"x":0,"y":0,"points":[{"x":5.666666666666667,"y":12.066666666666666},{"x":6.9,"y":9.333333333333334},{"x":10.366666666666667,"y":9.4},{"x":13.033333333333333,"y":14.366666666666667}],"staticBody":true,"hidden":true,"center":{"x":0,"y":0},"_inherited":{"p":1},"selected":false},{"id":33,"x":0,"y":0,"points":[{"x":11.733333333333333,"y":10.933333333333334},{"x":20.233333333333334,"y":11.266666666666667},{"x":13.433333333333334,"y":14.333333333333334}],"staticBody":true,"hidden":true,"center":{"x":0,"y":0},"_inherited":{"p":1},"selected":false},{"id":34,"x":0,"y":0,"points":[{"x":20.4,"y":11.433333333333334},{"x":23.033333333333335,"y":14.4},{"x":14.833333333333334,"y":14.466666666666667}],"staticBody":true,"hidden":true,"center":{"x":0,"y":0},"_inherited":{"p":1},"selected":false},{"id":35,"x":0.21666666666666667,"y":7.233333333333333,"halfHeight":7.066666666666666,"halfWidth":0.11666666666666667,"staticBody":true,"hidden":true,"type":"RectangleZone","impulseAngle":90,"_inherited":{"p":2},"selected":false},{"id":36,"x":23,"y":7.033333333333333,"halfHeight":7,"halfWidth":0.13333333333333333,"staticBody":true,"hidden":true,"type":"RectangleZone","impulseAngle":90}];
  rm = new ResourceManager({
    imageDir: 'images/game/'
  });
  var backImg = rm.loadImage('firesky.jpg');
  var foreImg = rm.loadImage('../mesa.png');
  var images = rm.loadFiles({
    archibald: 'archibald.jpg',
    arnold: 'arnold.jpg',
    bikeshed: 'bikeshed.jpg',
    chedeau: 'chedeau.jpg',
    egorov: 'egorov.jpg',
    falkvinge: 'falkvinge.jpg',
    ford: 'ford.jpg',
    herhut: 'herhut.jpg',
    ingalls: 'ingalls.jpg',
    irish: 'irish.jpg',
    khatri: 'khatri.jpg',
    mckenna: 'mckenna.jpg',
    nicholls: 'nicholls.jpg',
    nolen: 'nolen.jpg',
    ruiz: 'ruiz.jpg',
    sharp: 'sharp.jpg',
    shawabkeh: 'shawabkeh.jpg',
    thornton: 'thornton.jpg',
    valletta: 'valletta.jpg',
    whelton: 'whelton.jpg',
    wingo: 'wingo.jpg'
  });
  cm = new CanvasManager({
    canvasId: 'badassCanvas',
    height: 440,
    width: 700,
    draw: function(ctx) {
      var entity, id;
      ctx.drawImage(backImg, 0, 0, this.width, this.height);
      for (id in world) {
        entity = world[id];
        if (!entity.hidden || showHidden) entity.draw(ctx);
      }
      ctx.drawImage(foreImg, 0, 0, this.width, this.height);
    }
  });
  box = new Box({
    intervalRate: 60,
    adaptive: false,
    width: cm.width,
    height: cm.height,
    scale: SCALE,
    gravityY: 9.8
  });
  box.setBodies(solids);

  for(key in images){
    if(key !== 'bg'){
      var image = images[key];
      var toon = new Toon({
        id: geomId,
        x: Math.random() * 16 + 3,
        y: Math.random() * 10 - 10,
        halfHeight: (64 / SCALE) / 2,
        halfWidth: (64 / SCALE) / 2,
        img: image,
        staticBody: false,
        restitution: 0.5,
        box: box
      });
      box.addBody(toon);
      world[geomId] = toon;
    }
    geomId++;
  }
  im = new InputManager({
    box: box,
    canvasManager: cm,
    mouseUp: function(event) {
      var obj;
      obj = getCollidedSprite(this.getMouseLoc(event));
      if (obj){
        playSound('yipee');
        return this.box.applyImpulse(obj.id, Math.random() * 360, 200);
      }
    },
    touchEnd: function(event) {
      return this.mouseUp(event.changedTouches[0]);
    },
    selectstart: function(event) {
      event.preventDefault();
      return false;
    }
  });
  im.bindMouse();
  im.bindTouch();
  im.bind(document, 'selectstart');
  game = new GameCore({
    canvasManager: cm,
    resourceManager: rm,
    update: function(elapsedTime) {
      var bodiesState, entity, id, marsh;
      try {
        box.update();
        bodiesState = box.getState();
        for (id in bodiesState) {
          entity = world[id];
          if (entity) {
            try {
              if (entity.y > 100) {
                box.removeBody(id);
                delete world[id];
              } else {
                entity.update(bodiesState[id]);
              }
            } catch (eu) {
              console.log(entity, bodiesState[id], eu);
            }
          }
        }
        if (debug) stats.update();
      } catch (updateE) {
        return console.log('error in update', updateE);
      }
    }
  });
  intersect = function(s1, s2, radiiSquared) {
    var distance_squared;
    distance_squared = Math.pow(s1.x - s2.x, 2) + Math.pow(s1.y - s2.y, 2);
    return distance_squared < radiiSquared;
  };
  getCollidedSprite = function(mouse) {
    var sprite, spriteId;
    for (spriteId in world) {
      sprite = world[spriteId];
      if (intersect(mouse, sprite, 2)) return sprite;
    }
    return null;
  };
  var playSound = function(sound){
    if(audioContext){
      try{
        var source = audioContext.createBufferSource(); // creates a sound source
        source.buffer = sounds[sound];                    // tell the source which sound to play
        source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
        source.noteOn(0);                          // play the source now
      }catch(se){
        console.info('error playing sound',se);
      }
    }
  }
  var loadSound = function(fileName){
    var request = new XMLHttpRequest();
        request.open('GET', 'sounds/'  + fileName + '.wav', true);
        request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
      audioContext.decodeAudioData(request.response, function(buffer) {
        sounds[fileName] = buffer;
      }, function(er){console.info('error loading sound',er)});
    }
    request.send();
  };
  return require(['dojo/dom-construct', 'dojo/_base/window', 'dojo/domReady!'], function(domConstruct, win) {
    if (debug) domConstruct.place(stats.getDomElement(), win.body(), 'last');
    try {
      audioContext = new webkitAudioContext();
    } catch(e) {
      console.info('Web Audio API is not supported in this browser');
    }

    if(audioContext){
      try{
        loadSound('yipee');
      }catch(ae){}
    }
    game.run();
  });
});