var assert = require('assert');
var game_objects = require('../game_objects.js')

describe('Card', function() {
  describe('#sumStack()', function() {
    it('check empty', function() {
      assert.equal(game_objects.Card.sumStack([]), 0);
    });
    it('check set of 1', function() {
      var card = new game_objects.Card(4);
      assert.equal(game_objects.Card.sumStack([card]), 4);
    });
    it('check set of 2', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(5);
      assert.equal(game_objects.Card.sumStack([card,card2]),6);
    });
    it('check set of 5', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      var card4 = new game_objects.Card(4);
      var card5 = new game_objects.Card(5);
      assert.equal(game_objects.Card.sumStack([card,card2,card3,card4,card5]),15);
    });
  });
  describe('#findMaxValueCard()', function() {
    it('check empty', function() {
      var maxCard = game_objects.Card.findMaxValueCard([]);
      assert.equal(maxCard, null);
    });
    it('check set of 1', function() {
      var card = new game_objects.Card(1);
      var maxCard = game_objects.Card.findMaxValueCard([card]);
      assert.equal(maxCard.id, card.id);
    });
    it('check set of 2', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var maxCard = game_objects.Card.findMaxValueCard([card,card2]);
      assert.equal(maxCard.id, card2.id);
    });
  });
  describe('#getMaxPlayerStack()', function() {
    it('check no stacks', function() {
      assert.equal(game_objects.Card.getMaxPlayerStack([]), null);
    });
    it('check empty stack', function() {
      assert.equal(game_objects.Card.getMaxPlayerStack([[]]), 0);
    });
    it('check one stack', function() {
      var card = new game_objects.Card(1);
      assert.equal(game_objects.Card.getMaxPlayerStack([[card]]), 0);
    });
    it('check two stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      assert.equal(game_objects.Card.getMaxPlayerStack([[],[]]), 0);
      assert.equal(game_objects.Card.getMaxPlayerStack([[card],[card2]]), 1);
      assert.equal(game_objects.Card.getMaxPlayerStack([[],[card,card2]]), 1);
      assert.equal(game_objects.Card.getMaxPlayerStack([[card2,card2],[card3]]), 0);
    });
    it('check three stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      assert.equal(game_objects.Card.getMaxPlayerStack([[],[],[]]), 0);
      assert.equal(game_objects.Card.getMaxPlayerStack([[card3],[card2],[card]]), 0);
      assert.equal(game_objects.Card.getMaxPlayerStack([[card],[card3],[card2]]), 1);
      assert.equal(game_objects.Card.getMaxPlayerStack([[card],[card2],[card3]]), 2);
      assert.equal(game_objects.Card.getMaxPlayerStack([[],[card],[card2,card3]]), 2);
    });
    it('check five stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      var card4 = new game_objects.Card(4);
      var card5 = new game_objects.Card(5);
      assert.equal(game_objects.Card.getMaxPlayerStack([[],[card],[card,card2,card3],[card4,card5],[]]), 3);
    });
  });
  describe('#rankPlayerStacks()', function() {
    it('check no stacks', function() {
      assert.equal(game_objects.Card.rankPlayerStacks([]).length, 0);
    });
    it('check empty stack', function() {
      var rankings = game_objects.Card.rankPlayerStacks([[]]); 
      assert.equal(rankings[0].idx, 0);
    });
    it('check one stack', function() {
      var card = new game_objects.Card(1);
      var rankings = game_objects.Card.rankPlayerStacks([[card]]); 
      assert.equal(rankings[0].idx, 0);
    });
    it('check two stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      var rankings = game_objects.Card.rankPlayerStacks([[card],[card2]]); 
      assert.equal(rankings[0].idx, 1);
      assert.equal(rankings[1].idx, 0);
      rankings = game_objects.Card.rankPlayerStacks([[],[card,card2]]);
      assert.equal(rankings[0].idx, 1);
      assert.equal(rankings[1].idx, 0);
      rankings = game_objects.Card.rankPlayerStacks([[card2,card2],[card3]]);
      assert.equal(rankings[0].idx, 0);
      assert.equal(rankings[1].idx, 1);
    });
    it('check three stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      var rankings = game_objects.Card.rankPlayerStacks([[card3],[card2],[card]]); 
      assert.equal(rankings[0].idx, 0);
      assert.equal(rankings[1].idx, 1);
      assert.equal(rankings[2].idx, 2);
      rankings = game_objects.Card.rankPlayerStacks([[card],[card3],[card2]]);
      assert.equal(rankings[0].idx, 1);
      assert.equal(rankings[1].idx, 2);
      assert.equal(rankings[2].idx, 0);
      rankings = game_objects.Card.rankPlayerStacks([[card],[card2],[card3]]);
      assert.equal(rankings[0].idx, 2);
      assert.equal(rankings[1].idx, 1);
      assert.equal(rankings[2].idx, 0);
      rankings = game_objects.Card.rankPlayerStacks([[card],[],[card2,card3]]);
      assert.equal(rankings[0].idx, 2);
      assert.equal(rankings[1].idx, 0);
      assert.equal(rankings[2].idx, 1);
    });
    it('check five stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      var card4 = new game_objects.Card(4);
      var card5 = new game_objects.Card(5);
      var rankings = game_objects.Card.rankPlayerStacks([[],[card],[card,card2,card3],[card4,card5],[]]); 
      assert.equal(rankings[0].idx,3);
      assert.equal(rankings[1].idx,2);
      assert.equal(rankings[2].idx,1);
    });
  });
  describe('#scoreStacksByRank()', function() {
    it('check no stacks', function() {
      assert.equal(game_objects.Card.scoreStacksByRank([]).length, 0);
    });
    it('check empty stack', function() {
      var scores = game_objects.Card.scoreStacksByRank([[]]); 
      assert.equal(scores[0], 0);
    });
    it('check one stack', function() {
      var card = new game_objects.Card(1);
      var scores = game_objects.Card.scoreStacksByRank([[card]]); 
      assert.equal(scores[0], 0);
    });
    it('check two stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      scores = game_objects.Card.scoreStacksByRank([[card],[card2]]); 
      assert.equal(scores[0], 3);
      assert.equal(scores[1], 6);
      scores = game_objects.Card.scoreStacksByRank([[],[card,card2]]);
      assert.equal(scores[0], 3);
      assert.equal(scores[1], 6);
      scores = game_objects.Card.scoreStacksByRank([[card2,card2],[card3]]);
      assert.equal(scores[0], 6);
      assert.equal(scores[1], 3);
    });
    it('check three stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      var scores = game_objects.Card.scoreStacksByRank([[card3],[card2],[card]]); 
      assert.equal(scores[0], 6);
      assert.equal(scores[1], 3);
      assert.equal(scores[2], 0);
      scores = game_objects.Card.scoreStacksByRank([[card],[card3],[card2]]);
      assert.equal(scores[0], 0);
      assert.equal(scores[1], 6);
      assert.equal(scores[2], 3);
      scores = game_objects.Card.scoreStacksByRank([[card],[card2],[card3]]);
      assert.equal(scores[0], 0);
      assert.equal(scores[1], 3);
      assert.equal(scores[2], 6);
      scores = game_objects.Card.scoreStacksByRank([[card],[],[card2,card3]]);
      assert.equal(scores[0], 3);
      assert.equal(scores[1], 0);
      assert.equal(scores[2], 6);
    });
    it('check five stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      var card4 = new game_objects.Card(4);
      var card5 = new game_objects.Card(5);
      var scores = game_objects.Card.scoreStacksByRank([[],[card],[card,card2,card3],[card4,card5],[]]); 
      assert.equal(scores[0],0);
      assert.equal(scores[1],0);
      assert.equal(scores[2],3);
      assert.equal(scores[3],6);
      assert.equal(scores[4],0);
    });
    it('check all scores equal', function() {
      var card2 = new game_objects.Card(2);
      for(var i = 3; i <= 5; i++) { // for each number of players
        var stacks = [];
        while(stacks.length < i) {
          stacks.push([card2]);
        }
        var scores = game_objects.Card.scoreStacksByRank(stacks); 
        for(var j = 0; j < scores.length; j++) {
          assert.equal(scores[j],0);
        }
      }
    });
    it('check first place ties', function() {
      var card1 = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      for(var i = 3; i <= 5; i++) { // for each number of players
        var stacks = [[card1]];
        while(stacks.length < i) {
          stacks.push([card2]);
        }
        var scores = game_objects.Card.scoreStacksByRank(stacks); 
        var expectedScore = Math.floor(6/(i-1));
        for(var j = 0; j < scores.length; j++) {
          if(j === 0) {
            assert.equal(scores[j],0);
          } else {
            assert.equal(scores[j],expectedScore);
          }
        }
      }
    });
    it('check second place ties', function() {
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      for(var i = 2; i <= 5; i++) { // for each number of players
        var stacks = [[card3]];
        while(stacks.length < i) {
          stacks.push([card2]);
        }
        var scores = game_objects.Card.scoreStacksByRank(stacks); 
        var expectedScore = Math.floor(3/(i-1));
        for(var j = 0; j < scores.length; j++) {
          if(j === 0) {
            assert.equal(scores[j],6);
          } else {
            assert.equal(scores[j],expectedScore);
          }
        }
      }
    });
    it('check last place penalty, no second place', function() {
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      for(var i = 2; i <= 5; i++) { // for each number of players
        var stacks = [[card3]];
        while(stacks.length < i) {
          stacks.push([card2]);
        }
        var scores = game_objects.Card.scoreStacksByRank(stacks,secondPlace=false,penalizeMin=true); 
        var expectedScore = Math.ceil(-6.0/(i-1));
        for(var j = 0; j < scores.length; j++) {
          if(j === 0) {
            assert.equal(scores[j],6);
          } else {
            assert.equal(scores[j],expectedScore);
          }
        }
      }
    });
  });
});

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
      assert.equal(new game_objects.PuddingCard().isValidStack([]), true);
    });
    it('check stack correct', function() {
      var card = new game_objects.PuddingCard();
      var card2 = new game_objects.PuddingCard();
      var card3 = new game_objects.PuddingCard();
      assert.equal(new game_objects.PuddingCard().isValidStack([card,card2,card3]), true);
      assert.equal(new game_objects.PuddingCard().isValidStack([card3,card2,card]), true);
      assert.equal(new game_objects.PuddingCard().isValidStack([card2,card3,card]), true);
    });
    it('check stack incorrect', function() {
      var card = new game_objects.PuddingCard();
      var card2 = new game_objects.PuddingCard();
      var card3 = new game_objects.DumplingCard();
      assert.equal(new game_objects.PuddingCard().isValidStack([card,card2,card3]), false);
      assert.equal(new game_objects.PuddingCard().isValidStack([card3,card,card2]), false);
      assert.equal(new game_objects.PuddingCard().isValidStack([card2,card3,card]), false);
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
      assert.equal(new game_objects.MakiCard().isValidStack([]), true);
    });
    it('check stack correct', function() {
      var card = new game_objects.MakiCard(1);
      var card2 = new game_objects.MakiCard(2);
      var card3 = new game_objects.MakiCard(3);
      assert.equal(new game_objects.MakiCard().isValidStack([card,card2,card3]), true);
      assert.equal(new game_objects.MakiCard().isValidStack([card3,card2,card]), true);
      assert.equal(new game_objects.MakiCard().isValidStack([card2,card3,card]), true);
    });
    it('check stack incorrect', function() {
      var card = new game_objects.MakiCard(1);
      var card2 = new game_objects.MakiCard(2);
      var card3 = new game_objects.DumplingCard();
      assert.equal(new game_objects.MakiCard().isValidStack([card,card2,card3]), false);
      assert.equal(new game_objects.MakiCard().isValidStack([card3,card,card2]), false);
      assert.equal(new game_objects.MakiCard().isValidStack([card2,card3,card]), false);
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
      assert.equal(new game_objects.DumplingCard().isValidStack([]), true);
    });
    it('check stack correct', function() {
      var card = new game_objects.DumplingCard();
      var card2 = new game_objects.DumplingCard();
      var card3 = new game_objects.DumplingCard();
      assert.equal(new game_objects.DumplingCard().isValidStack([card,card2,card3]), true);
      assert.equal(new game_objects.DumplingCard().isValidStack([card3,card2,card]), true);
      assert.equal(new game_objects.DumplingCard().isValidStack([card2,card3,card]), true);
    });
    it('check stack incorrect', function() {
      var card = new game_objects.DumplingCard();
      var card2 = new game_objects.DumplingCard();
      var card3 = new game_objects.MakiCard(3);
      assert.equal(new game_objects.DumplingCard().isValidStack([card,card2,card3]), false);
      assert.equal(new game_objects.DumplingCard().isValidStack([card3,card,card2]), false);
      assert.equal(new game_objects.DumplingCard().isValidStack([card2,card3,card]), false);
    });
    it('check stack size', function() {
      for(var i = 0; i < 6; i++) {
        var stack = [];
        while(stack.length < i) {
          stack.push(new game_objects.DumplingCard());
        }
        if(i <= 5) {
          assert.equal(new game_objects.DumplingCard().isValidStack(stack), true);
        } else {
          assert.equal(new game_objects.DumplingCard().isValidStack(stack), false);
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
      assert.equal(new game_objects.SashimiCard().isValidStack([]), true);
    });
    it('check stack correct cards', function() {
      var card = new game_objects.SashimiCard();
      var card2 = new game_objects.SashimiCard();
      var card3 = new game_objects.SashimiCard();
      assert.equal(new game_objects.SashimiCard().isValidStack([card,card2,card3]), true);
      assert.equal(new game_objects.SashimiCard().isValidStack([card3,card2,card]), true);
      assert.equal(new game_objects.SashimiCard().isValidStack([card2,card3,card]), true);
    });
    it('check stack incorrect cards', function() {
      var card = new game_objects.SashimiCard();
      var card2 = new game_objects.SashimiCard();
      var card3 = new game_objects.DumplingCard();
      assert.equal(new game_objects.SashimiCard().isValidStack([card,card2,card3]), false);
      assert.equal(new game_objects.SashimiCard().isValidStack([card3,card,card2]), false);
      assert.equal(new game_objects.SashimiCard().isValidStack([card2,card3,card]), false);
    });
    it('check stack size', function() {
      for(var i = 0; i < 4; i++) {
        var stack = [];
        while(stack.length < i) {
          stack.push(new game_objects.SashimiCard());
        }
        if(i <= 3) {
          assert.equal(new game_objects.SashimiCard().isValidStack(stack), true);
        } else {
          assert.equal(new game_objects.SashimiCard().isValidStack(stack), false);
        }
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
      assert.equal(new game_objects.TempuraCard().isValidStack([]), true);
    });
    it('check stack correct', function() {
      var card = new game_objects.TempuraCard();
      var card2 = new game_objects.TempuraCard();
      assert.equal(new game_objects.TempuraCard().isValidStack([card,card2]), true);
      assert.equal(new game_objects.TempuraCard().isValidStack([card2,card]), true);
    });
    it('check stack incorrect', function() {
      var card = new game_objects.TempuraCard();
      var card2 = new game_objects.DumplingCard();
      assert.equal(new game_objects.TempuraCard().isValidStack([card,card2]), false);
      assert.equal(new game_objects.TempuraCard().isValidStack([card2,card]), false);
    });
    it('check stack size', function() {
      for(var i = 0; i < 3; i++) {
        var stack = [];
        while(stack.length < i) {
          stack.push(new game_objects.TempuraCard());
        }
        if(i <= 2) {
          assert.equal(new game_objects.TempuraCard().isValidStack(stack), true);
        } else {
          assert.equal(new game_objects.TempuraCard().isValidStack(stack), false);
        }
      }
    });
  });
});
