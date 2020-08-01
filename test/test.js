const assert = require('assert');
const game_objects = require('../game_objects')



describe('PuddingCard', function() {
  describe('#constructor()', function() {
    it('type and name', function() {
      var card = new game_objects.PuddingCard();
      assert.equal(card.type, "pudding");
      assert.equal(card.name, "pudding");
    });
  });
  describe('#isValidStack()', function() {
    it('check empty', function() {
      assert.isOk(new game_objects.PuddingCard().isValidStack([]));
    });
    it('check stack correct', function() {
      var card = new game_objects.PuddingCard();
      var card2 = new game_objects.PuddingCard();
      var card3 = new game_objects.PuddingCard();
      assert.isOk(new game_objects.PuddingCard().isValidStack([card,card2,card3]));
      assert.isOk(new game_objects.PuddingCard().isValidStack([card3,card2,card]));
      assert.isOk(new game_objects.PuddingCard().isValidStack([card2,card3,card]));
    });
    it('check stack incorrect', function() {
      var card = new game_objects.PuddingCard();
      var card2 = new game_objects.PuddingCard();
      var card3 = new game_objects.DumplingCard();
      assert.isNotOk(new game_objects.PuddingCard().isValidStack([card,card2,card3]));
      assert.isNotOk(new game_objects.PuddingCard().isValidStack([card3,card,card2]));
      assert.isNotOk(new game_objects.PuddingCard().isValidStack([card2,card3,card]));
    });
  });
});

describe('MakiCard', function() {
  describe('#constructor()', function() {
    it('type, name and value', function() {
      var card = new game_objects.MakiCard(1);
      assert.equal(card.type, "maki");
      assert.equal(card.name, "maki");
      assert.equal(card.value, 1);
    });
  });
  describe('#isValidStack()', function() {
    it('check empty', function() {
      assert.isOk(new game_objects.MakiCard().isValidStack([]));
    });
    it('check stack correct', function() {
      var card = new game_objects.MakiCard(1);
      var card2 = new game_objects.MakiCard(2);
      var card3 = new game_objects.MakiCard(3);
      assert.isOk(new game_objects.MakiCard().isValidStack([card,card2,card3]));
      assert.isOk(new game_objects.MakiCard().isValidStack([card3,card2,card]));
      assert.isOk(new game_objects.MakiCard().isValidStack([card2,card3,card]));
    });
    it('check stack incorrect', function() {
      var card = new game_objects.MakiCard(1);
      var card2 = new game_objects.MakiCard(2);
      var card3 = new game_objects.DumplingCard();
      assert.isNotOk(new game_objects.MakiCard().isValidStack([card,card2,card3]));
      assert.isNotOk(new game_objects.MakiCard().isValidStack([card3,card,card2]));
      assert.isNotOk(new game_objects.MakiCard().isValidStack([card2,card3,card]));
    });
  });
});

describe('DumplingCard', function() {
  describe('#constructor()', function() {
    it('type and name', function() {
      var card = new game_objects.DumplingCard();
      assert.equal(card.type, "dumpling");
      assert.equal(card.name, "dumpling");
    });
  });
  describe('#isValidStack()', function() {
    it('check empty', function() {
      assert.isOk(new game_objects.DumplingCard().isValidStack([]));
    });
    it('check stack correct cards', function() {
      var card = new game_objects.DumplingCard();
      var card2 = new game_objects.DumplingCard();
      var card3 = new game_objects.DumplingCard();
      assert.isOk(new game_objects.DumplingCard().isValidStack([card,card2,card3]));
      assert.isOk(new game_objects.DumplingCard().isValidStack([card3,card2,card]));
      assert.isOk(new game_objects.DumplingCard().isValidStack([card2,card3,card]));
    });
    it('check stack incorrect cards', function() {
      var card = new game_objects.DumplingCard();
      var card2 = new game_objects.DumplingCard();
      var card3 = new game_objects.MakiCard(3);
      assert.isNotOk(new game_objects.DumplingCard().isValidStack([card,card2,card3]));
      assert.isNotOk(new game_objects.DumplingCard().isValidStack([card3,card,card2]));
      assert.isNotOk(new game_objects.DumplingCard().isValidStack([card2,card3,card]));
    });
    it('check stack size', function() {
      for(var i = 0; i < 6; i++) {
        var stack = [];
        while(stack.length < i) {
          stack.push(new game_objects.DumplingCard());
        }
        if(i <= 5) {
          assert.isOk(new game_objects.DumplingCard().isValidStack(stack));
        } else {
          assert.isNotOk(new game_objects.DumplingCard().isValidStack(stack));
        }
      }
    });
  });
  describe('#score()', function() {
    it('check empty', function() {
      assert.equal(new game_objects.DumplingCard().score([]), 0)
    });
    it('check stack size', function() {
      var stack = [];
      var scores = [1,3,6,10,15];
      for(var i = 0; i < 5; i++) {
        stack.push(new game_objects.DumplingCard());
        assert.equal(new game_objects.DumplingCard().score(stack),scores[i])
      }
    });
  });
});

describe('SashimiCard', function() {
  describe('#constructor()', function() {
    it('type and name', function() {
      var card = new game_objects.SashimiCard();
      assert.equal(card.type, "sashimi");
      assert.equal(card.name, "sashimi");
    });
  });
  describe('#isValidStack()', function() {
    it('check empty', function() {
      assert.isOk(new game_objects.SashimiCard().isValidStack([]));
    });
    it('check stack correct cards', function() {
      var card = new game_objects.SashimiCard();
      var card2 = new game_objects.SashimiCard();
      var card3 = new game_objects.SashimiCard();
      assert.isOk(new game_objects.SashimiCard().isValidStack([card,card2,card3]));
      assert.isOk(new game_objects.SashimiCard().isValidStack([card3,card2,card]));
      assert.isOk(new game_objects.SashimiCard().isValidStack([card2,card3,card]));
    });
    it('check stack incorrect cards', function() {
      var card = new game_objects.SashimiCard();
      var card2 = new game_objects.SashimiCard();
      var card3 = new game_objects.DumplingCard();
      assert.isNotOk(new game_objects.SashimiCard().isValidStack([card,card2,card3]));
      assert.isNotOk(new game_objects.SashimiCard().isValidStack([card3,card,card2]));
      assert.isNotOk(new game_objects.SashimiCard().isValidStack([card2,card3,card]));
    });
    it('check stack size', function() {
      for(var i = 0; i < 4; i++) {
        var stack = [];
        while(stack.length < i) {
          stack.push(new game_objects.SashimiCard());
        }
        if(i <= 3) {
          assert.isOk(new game_objects.SashimiCard().isValidStack(stack));
        } else {
          assert.isNotOk(new game_objects.SashimiCard().isValidStack(stack));
        }
      }
    });
  });
  describe('#score()', function() {
    it('check empty', function() {
      assert.equal(new game_objects.SashimiCard().score([]), 0)
    });
    it('check stack size', function() {
      var stack = [];
      var scores = [0,0,10];
      for(var i = 0; i < 3; i++) {
        stack.push(new game_objects.SashimiCard());
        assert.equal(new game_objects.SashimiCard().score(stack),scores[i])
      }
    });
  });
});

describe('TempuraCard', function() {
  describe('#constructor()', function() {
    it('type and name', function() {
      var card = new game_objects.TempuraCard();
      assert.equal(card.type, "tempura");
      assert.equal(card.name, "tempura");
    });
  });
  describe('#isValidStack()', function() {
    it('check empty', function() {
      assert.isOk(new game_objects.TempuraCard().isValidStack([]));
    });
    it('check stack correct cards', function() {
      var card = new game_objects.TempuraCard();
      var card2 = new game_objects.TempuraCard();
      assert.isOk(new game_objects.TempuraCard().isValidStack([card,card2]));
      assert.isOk(new game_objects.TempuraCard().isValidStack([card2,card]));
    });
    it('check stack incorrect cards', function() {
      var card = new game_objects.TempuraCard();
      var card2 = new game_objects.DumplingCard();
      assert.isNotOk(new game_objects.TempuraCard().isValidStack([card,card2]));
      assert.isNotOk(new game_objects.TempuraCard().isValidStack([card2,card]));
    });
    it('check stack size', function() {
      for(var i = 0; i < 3; i++) {
        var stack = [];
        while(stack.length < i) {
          stack.push(new game_objects.TempuraCard());
        }
        if(i <= 2) {
          assert.isOk(new game_objects.TempuraCard().isValidStack(stack));
        } else {
          assert.isNotOk(new game_objects.TempuraCard().isValidStack(stack));
        }
      }
    });
  });
  describe('#score()', function() {
    it('check empty', function() {
      assert.equal(new game_objects.TempuraCard().score([]), 0)
    });
    it('check stack size', function() {
      var stack = [];
      var scores = [0,5];
      for(var i = 0; i < 2; i++) {
        stack.push(new game_objects.TempuraCard());
        assert.equal(new game_objects.TempuraCard().score(stack),scores[i])
      }
    });
  });
});

describe('WasabiCard', function() {
  describe('#constructor()', function() {
    it('type and name', function() {
      var card = new game_objects.WasabiCard();
      assert.equal(card.type, "wasabi");
      assert.equal(card.name, "wasabi");
    });
  });
  describe('#isValidStack()', function() {
    it('check empty', function() {
      assert.isNotOk(new game_objects.WasabiCard().isValidStack([]));
    });
    it('check stack correct cards', function() {
      var card = new game_objects.WasabiCard();
      assert.isOk(new game_objects.WasabiCard().isValidStack([card]));
    });
    it('check stack incorrect cards', function() {
      var card = new game_objects.WasabiCard();
      var card2 = new game_objects.NigiriCard();
      var card3 = new game_objects.MakiCard(1);
      assert.isNotOk(new game_objects.WasabiCard().isValidStack([card2]));
      assert.isNotOk(new game_objects.WasabiCard().isValidStack([card,card2]));
      assert.isNotOk(new game_objects.WasabiCard().isValidStack([card3,card]));
    });
    it('check stack size', function() {
      var card = new game_objects.WasabiCard();
      var card2 = new game_objects.NigiriCard();
      assert.isNotOk(new game_objects.WasabiCard().isValidStack([card,card2]));
      assert.isNotOk(new game_objects.WasabiCard().isValidStack([card,card]));
    });
  });
  describe('#score()', function() {
    it('check empty', function() {
      assert.equal(new game_objects.WasabiCard().score([]), 0)
    });
    it('check stack size', function() {
      var stack = [];
      var scores = [0,0];
      for(var i = 0; i < 2; i++) {
        stack.push(new game_objects.WasabiCard());
        assert.equal(new game_objects.WasabiCard().score(stack),scores[i])
      }
    });
  });
});

describe('NigiriCard', function() {
  describe('#constructor()', function() {
    it('type and name', function() {
      var card = new game_objects.NigiriCard();
      assert.equal(card.type, "nigiri");
      assert.equal(card.name, null);
    });
  });
  describe('#isValidStack()', function() {
    it('check empty', function() {
      assert.isOk(new game_objects.NigiriCard().isValidStack([]));
    });
    it('check stack correct cards', function() {
      var card = new game_objects.NigiriCard();
      var card2 = new game_objects.NigiriCard();
      var card3 = new game_objects.WasabiCard();
      assert.isOk(new game_objects.NigiriCard().isValidStack([card,card2]));
      assert.isOk(new game_objects.NigiriCard().isValidStack([card,card2,card]));
      assert.isOk(new game_objects.NigiriCard().isValidStack([card2,card]));
      assert.isOk(new game_objects.NigiriCard().isValidStack([card2,card3]));
      assert.isOk(new game_objects.NigiriCard().isValidStack([card3,card]));
    });
    it('check stack incorrect cards', function() {
      var card = new game_objects.NigiriCard();
      var card2 = new game_objects.DumplingCard();
      var card3 = new game_objects.WasabiCard();
      assert.isNotOk(new game_objects.NigiriCard().isValidStack([card3]));
      assert.isNotOk(new game_objects.NigiriCard().isValidStack([card,card2]));
      assert.isNotOk(new game_objects.NigiriCard().isValidStack([card2,card]));
      assert.isNotOk(new game_objects.NigiriCard().isValidStack([card3,card,card2]));
    });
    it('check stack size', function() {
      for(var i = 2; i <= 3; i++) {
        var stack = [new game_objects.WasabiCard()];
        while(stack.length < i) {
          stack.push(new game_objects.NigiriCard());
        }
        if(i === 2) {
          assert.isOk(new game_objects.NigiriCard().isValidStack(stack));
        } else {
          assert.isNotOk(new game_objects.NigiriCard().isValidStack(stack));
        }
      }
    });
  });
  describe('#score()', function() {
    it('check empty', function() {
      assert.equal(new game_objects.NigiriCard().score([]), 0)
    });
    it('check stack size no wasabi', function() {
      for(var s = 1; s <= 3; s++) {
        var stack = [];
        for(var i = 1; i <= 5; i++) {
          stack.push(new game_objects.NigiriCard(s));
          assert.equal(new game_objects.NigiriCard().score(stack),i*s)
        }
      }
      var card = new game_objects.NigiriCard(1);
      var card2 = new game_objects.NigiriCard(2);
      var card3 = new game_objects.NigiriCard(3);
      assert.equal(new game_objects.NigiriCard().score([card,card2]),3)
      assert.equal(new game_objects.NigiriCard().score([card,card2,card3]),6)
    });
    it('check wasabi', function() {
      for(var s = 1; s <= 3; s++) {
        var stack = [new game_objects.WasabiCard(),new game_objects.NigiriCard(s)];
        assert.equal(new game_objects.NigiriCard().score(stack),3*s)
      }
    });
  });
});
