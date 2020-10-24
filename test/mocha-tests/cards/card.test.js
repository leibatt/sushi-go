const assert = require('chai').assert;
const cards = require("../../cards")

runTests = function() {
  describe("Card", function() {
    describe("#isRelevantStack()", function() {
      it("cards of all the same type should be relevant", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        card.type = "test";
        card2.type = "test";
        card3.type = "test";
        assert.isOk(card.isRelevantStack([card2,card3]));
        assert.isOk(card2.isRelevantStack([card,card3]));
        assert.isOk(card3.isRelevantStack([card,card2]));
      });
      it("cards with different types should not be relevant", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        card.type = "test";
        card2.type = "test";
        card3.type = "something";
        assert.isNotOk(card.isRelevantStack([card2,card3]));
        assert.isNotOk(card2.isRelevantStack([card,card3]));
        assert.isNotOk(card3.isRelevantStack([card,card2]));
      });
    });
    describe("#isValidStack()", function() {
      it("return the same results as isRelevantStack", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        card.type = "test";
        card2.type = "test";
        card3.type = "test";
        assert.equal(card.isRelevantStack([card2,card3]),card.isValidStack([card2,card3]));
        card3.type = "something";
        assert.equal(card.isRelevantStack([card2,card3]),card.isValidStack([card2,card3]));
      });
    });
    describe("#rankCardsByValue()", function() {
      it("rank cards with value 1, 2, 3 as 3, 2, 1", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        var orig = [card,card2,card3];
        var target = [card3,card2,card];
        var ranked = cards.Card.rankCardsByValue(orig.slice()); // pass a copy, just in case
        for(var i = 0; i < target.length; i++) {
          assert.equal(target[i].value,ranked[i].value);
        }
      });
    });
    describe("#findMaxValueCard()", function() {
      it("empty stack should return null", function() {
        var maxCard = cards.Card.findMaxValueCard([]);
        assert.equal(maxCard, null);
      });
      it("stack of 1 card returns the value of that card", function() {
        var card = new cards.Card(1);
        var maxCard = cards.Card.findMaxValueCard([card]);
        assert.equal(maxCard.id, card.id);
      });
      it("stack of 2 cards (1,2) should return the ID of the higher value card (2)", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var maxCard = cards.Card.findMaxValueCard([card,card2]);
        assert.equal(maxCard.id, card2.id);
      });
      it("stack of 3 cards (1,2,3) should return the ID of the highest value card (3)", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        var maxCard = cards.Card.findMaxValueCard([card,card2,card3]);
        assert.equal(maxCard.id,card3.id);
      });
    });
    describe("#getMaxPlayerStack()", function() {
      it("check no stacks", function() {
        assert.equal(cards.Card.getMaxPlayerStack([]), null);
      });
      it("check empty stack", function() {
        assert.equal(cards.Card.getMaxPlayerStack([[]]), 0);
      });
      it("check one stack", function() {
        var card = new cards.Card(1);
        assert.equal(cards.Card.getMaxPlayerStack([[card]]), 0);
      });
      it("check two stacks", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        assert.equal(cards.Card.getMaxPlayerStack([[],[]]), 0);
        assert.equal(cards.Card.getMaxPlayerStack([[card],[card2]]), 1);
        assert.equal(cards.Card.getMaxPlayerStack([[],[card,card2]]), 1);
        assert.equal(cards.Card.getMaxPlayerStack([[card2,card2],[card3]]), 0);
      });
      it("check three stacks", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        assert.equal(cards.Card.getMaxPlayerStack([[],[],[]]), 0);
        assert.equal(cards.Card.getMaxPlayerStack([[card3],[card2],[card]]), 0);
        assert.equal(cards.Card.getMaxPlayerStack([[card],[card3],[card2]]), 1);
        assert.equal(cards.Card.getMaxPlayerStack([[card],[card2],[card3]]), 2);
        assert.equal(cards.Card.getMaxPlayerStack([[],[card],[card2,card3]]), 2);
      });
      it("check five stacks", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        var card4 = new cards.Card(4);
        var card5 = new cards.Card(5);
        assert.equal(cards.Card.getMaxPlayerStack([[],[card],[card,card2,card3],[card4,card5],[]]), 3);
      });
    });
    describe("#rankPlayerStacks()", function() {
      it("check no stacks", function() {
        assert.equal(cards.Card.rankPlayerStacks([]).length, 0);
      });
      it("check empty stack", function() {
        var rankings = cards.Card.rankPlayerStacks([[]]); 
        assert.equal(rankings[0].idx, 0);
      });
      it("check one stack", function() {
        var card = new cards.Card(1);
        var rankings = cards.Card.rankPlayerStacks([[card]]); 
        assert.equal(rankings[0].idx, 0);
      });
      it("check two stacks", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        var rankings = cards.Card.rankPlayerStacks([[card],[card2]]); 
        assert.equal(rankings[0].idx, 1);
        assert.equal(rankings[1].idx, 0);
        rankings = cards.Card.rankPlayerStacks([[],[card,card2]]);
        assert.equal(rankings[0].idx, 1);
        assert.equal(rankings[1].idx, 0);
        rankings = cards.Card.rankPlayerStacks([[card2,card2],[card3]]);
        assert.equal(rankings[0].idx, 0);
        assert.equal(rankings[1].idx, 1);
      });
      it("check three stacks", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        var rankings = cards.Card.rankPlayerStacks([[card3],[card2],[card]]); 
        assert.equal(rankings[0].idx, 0);
        assert.equal(rankings[1].idx, 1);
        assert.equal(rankings[2].idx, 2);
        rankings = cards.Card.rankPlayerStacks([[card],[card3],[card2]]);
        assert.equal(rankings[0].idx, 1);
        assert.equal(rankings[1].idx, 2);
        assert.equal(rankings[2].idx, 0);
        rankings = cards.Card.rankPlayerStacks([[card],[card2],[card3]]);
        assert.equal(rankings[0].idx, 2);
        assert.equal(rankings[1].idx, 1);
        assert.equal(rankings[2].idx, 0);
        rankings = cards.Card.rankPlayerStacks([[card],[],[card2,card3]]);
        assert.equal(rankings[0].idx, 2);
        assert.equal(rankings[1].idx, 0);
        assert.equal(rankings[2].idx, 1);
      });
      it("check five stacks", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        var card4 = new cards.Card(4);
        var card5 = new cards.Card(5);
        var rankings = cards.Card.rankPlayerStacks([[],[card],[card,card2,card3],[card4,card5],[]]); 
        assert.equal(rankings[0].idx,3);
        assert.equal(rankings[1].idx,2);
        assert.equal(rankings[2].idx,1);
      });
    });
    describe("#sumStack()", function() {
      it("empty stacks should return 0", function() {
        assert.equal(cards.Card.sumStack([]), 0);
      });
      it("stacks of one card should return the card's value", function() {
        var card = new cards.Card(4);
        assert.equal(cards.Card.sumStack([card]), 4);
      });
      it("stacks of 2 cards (examples: (1,5) and (2,4)) should return the sum of the 2 cards (6)", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(5);
        assert.equal(cards.Card.sumStack([card,card2]),6);
        card = new cards.Card(2);
        card2 = new cards.Card(4);
        assert.equal(cards.Card.sumStack([card,card2]),6);
      });
      it("sum of 5 cards (1, 2, 3, 4, 5) should return 15", function() {
        var card = new cards.Card(1);
        var card2 = new cards.Card(2);
        var card3 = new cards.Card(3);
        var card4 = new cards.Card(4);
        var card5 = new cards.Card(5);
        assert.equal(cards.Card.sumStack([card,card2,card3,card4,card5]),15);
      });
    });
  });
};

module.exports = {
  runTests: runTests
}
