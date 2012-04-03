
/*

Copyright 2011 Luis Montes (http://azprogrammer.com)

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

  define(['dojo/_base/declare', 'scripts/thirdparty/Box2d.min.js'], function(declare) {
    var b2Body, b2BodyDef, b2CircleShape, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2PolygonShape, b2Vec2, b2World;
    b2Vec2 = Box2D.Common.Math.b2Vec2;
    b2BodyDef = Box2D.Dynamics.b2BodyDef;
    b2Body = Box2D.Dynamics.b2Body;
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    b2Fixture = Box2D.Dynamics.b2Fixture;
    b2World = Box2D.Dynamics.b2World;
    b2MassData = Box2D.Collision.Shapes.b2MassData;
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    return declare('Box', null, {
      intervalRate: 60,
      adaptive: false,
      width: 640,
      height: 480,
      scale: 30,
      bodiesMap: null,
      fixturesMap: null,
      world: null,
      gravityX: 0,
      gravityY: 10,
      allowSleep: true,
      constructor: function(args) {
        declare.safeMixin(this, args);
        if (args.intervaleRate) this.intervalRate = parseInt(args.intervalRate);
        if (this.bodiesMap == null) this.bodiesMap = [];
        if (this.fixturesMap == null) this.fixturesMap = [];
        return this.world = new b2World(new b2Vec2(this.gravityX, this.gravityY), this.allowSleep);
      },
      update: function() {
        var start, stepRate;
        start = Date.now();
        stepRate = (this.adaptive ? (now - this.lastTimestamp) / 1000 : 1 / this.intervalRate);
        this.world.Step(stepRate, 10, 10);
        this.world.ClearForces();
        return Date.now() - start;
      },
      getState: function() {
        var b, state;
        state = {};
        b = this.world.GetBodyList();
        while (b) {
          if (b.IsActive() && typeof b.GetUserData() !== "undefined" && (b.GetUserData() != null)) {
            state[b.GetUserData()] = {
              x: b.GetPosition().x,
              y: b.GetPosition().y,
              angle: b.GetAngle(),
              center: {
                x: b.GetWorldCenter().x,
                y: b.GetWorldCenter().y
              }
            };
          }
          b = b.m_next;
        }
        return state;
      },
      setBodies: function(bodyEntities) {
        var entity, id;
        console.log('bodies', bodyEntities);
        for (id in bodyEntities) {
          entity = bodyEntities[id];
          this.addBody(entity);
        }
        return this.ready = true;
      },
      addBody: function(entity) {
        var bodyDef, fixDef, i, point, points, vec, _len, _ref;
        bodyDef = new b2BodyDef();
        fixDef = new b2FixtureDef();
        fixDef.restitution = entity.restitution;
        fixDef.density = entity.density;
        fixDef.friction = entity.friction;
        if (entity.staticBody) {
          bodyDef.type = b2Body.b2_staticBody;
        } else {
          bodyDef.type = b2Body.b2_dynamicBody;
        }
        if (entity.radius) {
          fixDef.shape = new b2CircleShape(entity.radius);
        } else if (entity.points) {
          points = [];
          _ref = entity.points;
          for (i = 0, _len = _ref.length; i < _len; i++) {
            point = _ref[i];
            vec = new b2Vec2();
            vec.Set(point.x, point.y);
            points[i] = vec;
          }
          fixDef.shape = new b2PolygonShape;
          fixDef.shape.SetAsArray(points, points.length);
        } else {
          fixDef.shape = new b2PolygonShape;
          fixDef.shape.SetAsBox(entity.halfWidth, entity.halfHeight);
        }
        bodyDef.position.x = entity.x;
        bodyDef.position.y = entity.y;
        bodyDef.userData = entity.id;
        bodyDef.linearDamping = entity.linearDamping;
        bodyDef.angularDamping = entity.angularDamping;
        this.bodiesMap[entity.id] = this.world.CreateBody(bodyDef);
        return this.fixturesMap[entity.id] = this.bodiesMap[entity.id].CreateFixture(fixDef);
      },
      applyImpulse: function(bodyId, degrees, power) {
        var body;
        body = this.bodiesMap[bodyId];
        if (body) {
          return body.ApplyImpulse(new b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), body.GetWorldCenter());
        }
      },
      removeBody: function(id) {
        if (this.bodiesMap[id]) {
          this.bodiesMap[id].DestroyFixture(this.fixturesMap[id]);
          this.world.DestroyBody(this.bodiesMap[id]);
          delete this.fixturesMap[id];
          return delete this.bodiesMap[id];
        }
      }
    });
  });

}).call(this);
