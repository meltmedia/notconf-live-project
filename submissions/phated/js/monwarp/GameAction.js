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
define(['dojo/_base/declare'], function(declare) {
  return declare('GameAction', null, {
    name: null,
    behavior: 0,
    amount: 0,
    state: 0,
    statics: {
      NORMAL: 0,
      DETECT_INITIAL_PRESS_ONLY: 1,
      STATE_RELEASED: 0,
      STATE_PRESSED: 1,
      STATE_WAITING_FOR_RELEASE: 2
    },
    constructor: function(args) {
      declare.safeMixin(this, args);
      return this.reset();
    },
    getName: function() {
      return this.name;
    },
    reset: function() {
      this.state = this.statics.STATE_RELEASED;
      return this.amount = 0;
    },
    tap: function() {
      this.press();
      return this.release();
    },
    press: function() {
      return this.state = this.statics.STATE_PRESSED;
    },
    pressAmt: function(amount) {
      if (this.state !== this.statics.STATE_WAITING_FOR_RELEASE) {
        this.amount += amount;
        return this.state = this.statics.STATE_PRESSED;
      }
    },
    release: function() {
      return this.state = this.statics.STATE_RELEASED;
    },
    isPressed: function() {
      if (this.state === this.statics.STATE_PRESSED) return true;
      return false;
    },
    getAmount: function() {
      var amount, retVal;
      retVal = this.amount;
      if (retVal !== 0) {
        if (this.state === this.statics.STATE_RELEASED) {
          amount = 0;
        } else if (this.behavior === this.statics.DETECT_INITIAL_PRESS_ONLY) {
          this.state = this.statics.STATE_WAITING_FOR_RELEASE;
          this.amount = 0;
        }
      }
      return retVal;
    }
  });
});
