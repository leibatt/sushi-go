var assert = require('chai').assert;
//const assert = require('assert');
const util = require('../util');


describe('testing util functions', function() {
  describe("#randomIntegerFromRange()", function() {
    it("should produce numbers between 7 and 9", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(7,9);
        assert.isOk(result >= 7 && result <= 9);
      }
    });
    it("should produce numbers between 6 and 51", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(6,51);
        assert.isOk(result >= 6 && result <= 51);
      }
    });
    it("should produce numbers between 13 and 27", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(13,27);
        assert.isOk(result >= 13 && result <= 27);
      }
    });
  });

  describe("#randomInteger()", function() {
    it("should produce numbers between 0 and 5", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomInteger(5);
        assert.isOk(result >= 0 && result <= 5);
      }
    });
    it("should produce numbers between 0 and 99", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomInteger(99);
        assert.isOk(result >= 0 && result <= 99);
      }
    });
    it("should produce numbers between 0 and 1954", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomInteger(1954);
        assert.isOk(result >= 0 && result <= 1954);
      }
    });
  });
});
