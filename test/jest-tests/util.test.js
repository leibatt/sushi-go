const util = require('../../util');

describe('testing util functions', function() {
  describe("#randomIntegerFromRange()", function() {
    test("should produce numbers between -7 and 9", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(7,9);
        expect(result >= -7 && result <= 9).toBeTruthy();
      }
    });
    test("should produce numbers between 6 and 51", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(6,51);
        expect(result >= 6 && result <= 51).toBeTruthy();
      }
    });
    test("should produce numbers between 0 and 1", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(0,1);
        expect(result >= 0 && result <= 1).toBeTruthy();
      }
    });
    test("should produce numbers between 83,111 and 2,706,318", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomIntegerFromRange(83111,2706318);
        expect(result >= 83111 && result <= 2706318).toBeTruthy();
      }
    });
  });

  describe("#randomInteger()", function() {
    test("should produce numbers between 0 and 5", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomInteger(5);
        expect(result >= 0 && result <= 5).toBeTruthy();
      }
    });
    test("should produce numbers between 0 and 99", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomInteger(99);
        expect(result >= 0 && result <= 99).toBeTruthy();
      }
    });
    test("should produce numbers between 0 and 1954", function() {
      for(var i = 0; i < 10; i++) {
        var result = util.randomInteger(1954);
        expect(result >= 0 && result <= 1954).toBeTruthy();
      }
    });
  });
  describe("#sum()", function() {
    test("should sum [1, 2, 3, 4] as 10", function() {
      expect(util.sum([1,2,3,4])).toEqual(10);
    });
    test("should sum [-1, 1]  as 0", function() {
      expect(util.sum([-1,1])).toEqual(0);
    });
    test("should sum []  as 0", function() {
      expect(util.sum([])).toEqual(0);
    });
  });
  describe("#shuffle()", function() {
    test("should still contain [1, 2, 3, 4] in shuffled array", function() {
      var res = [1,2,3,4];
      util.shuffle(res);
      [1,2,3,4].forEach(i => expect(res.indexOf(i) >= 0).toBeTruthy());
    });
    test("should still contain [-1, 0, 1] in shuffled array", function() {
      var res = [-1,0,1];
      util.shuffle(res);
      [-1,0,1].forEach(i => expect(res.indexOf(i) >= 0).toBeTruthy());
    });
    test("[] should still be empty after shuffle", function() {
      var res = [];
      expect(res.length === 0).toBeTruthy();
    });
  });
});
