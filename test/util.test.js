const assert = require('chai').assert;
const util = require('../util');


describe('testing util functions', function() {
  describe("#randomIntegerFromRange()", function() {
    it("should produce numbers between -7 and 9", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(7,9);
        assert.isOk(result >= -7 && result <= 9);
      }
    });
    it("should produce numbers between 6 and 51", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(6,51);
        assert.isOk(result >= 6 && result <= 51);
      }
    });
    it("should produce numbers between 0 and 1", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(0,1);
        assert.isOk(result >= 0 && result <= 1);
      }
    });
    it("should produce numbers between 83,111 and 2,706,318", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(83111,2706318);
        assert.isOk(result >= 83111 && result <= 2706318);
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
  describe("#sum()", function() {
    it("should sum [1, 2, 3, 4] as 10", function() {
      assert.equal(util.sum([1,2,3,4]),10);
    });
    it("should sum [-1, 1]  as 0", function() {
      assert.equal(util.sum([-1,1]),0);
    });
    it("should sum []  as 0", function() {
      assert.equal(util.sum([]),0);
    });
  });
  describe("#shuffle()", function() {
    it("should still contain [1, 2, 3, 4] in shuffled array", function() {
      var res = [1,2,3,4];
      util.shuffle(res);
      [1,2,3,4].forEach(i => assert.isOk(res.indexOf(i) >= 0));
    });
    it("should still contain [-1, 0, 1] in shuffled array", function() {
      var res = [-1,0,1];
      util.shuffle(res);
      [-1,0,1].forEach(i => assert.isOk(res.indexOf(i) >= 0));
    });
    it("[] should still be empty after shuffle", function() {
      var res = [];
      assert.isOk(res.length === 0);
    });
  });
});
