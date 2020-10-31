const cards = require("../../cards")

describe("Nigiri Cards", function() {
  describe("Nigiri Base", function() {
    test("Check type is 'nigiri'", function() {
      let card = new cards.NigiriCard();
      expect(card.type).toEqual("nigiri");
    });

    // TODO: test isRelevantStack function
    //   type is nigiri, or wasabi, with count of wasabi=1
    // TODO: test score function
    //   make sure for a relevant stack, we return just the value of the cards in the stack
    //   make sure for a irrelevant stack, we return 0
  });
  describe("Egg Nigiri", function() {
    test("Check type is 'nigiri', name is 'egg', and value=1", function() {
      let card = new cards.EggNigiriCard();
      expect(card.type).toEqual("nigiri");
      expect(card.name).toEqual("egg");
      expect(card.value).toEqual(1);
    });
  });
  describe("Salmon Nigiri", function() {
    test("Check type is 'nigiri', name is 'salmon', and value=2", function() {
      let card = new cards.SalmonNigiriCard();
      expect(card.type).toEqual("nigiri");
      expect(card.name).toEqual("salmon");
      expect(card.value).toEqual(2);
    });
  });
});

describe("Card", function() {
  describe("#isRelevantStack()", function() {
    test("cards of all the same type should be relevant", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      card.type = "test";
      card2.type = "test";
      card3.type = "test";
      expect(card.isRelevantStack([card2,card3])).toBeTruthy();
      expect(card2.isRelevantStack([card,card3])).toBeTruthy();
      expect(card3.isRelevantStack([card,card2])).toBeTruthy();
    });
    test("cards with different types should not be relevant", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      card.type = "test";
      card2.type = "test";
      card3.type = "something";
      expect(card.isRelevantStack([card2,card3])).toBeFalsy();
      expect(card2.isRelevantStack([card,card3])).toBeFalsy();
      expect(card3.isRelevantStack([card,card2])).toBeFalsy();
    });
  });
  describe("#isValidStack()", function() {
    test("return the same results as isRelevantStack", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      card.type = "test";
      card2.type = "test";
      card3.type = "test";
      expect(card.isRelevantStack([card2,card3])).toEqual(card.isValidStack([card2,card3]));
      card3.type = "something";
      expect(card.isRelevantStack([card2,card3])).toEqual(card.isValidStack([card2,card3]));
    });
  });
  describe("#rankCardsByValue()", function() {
    test("rank cards with value 1, 2, 3 as 3, 2, 1", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      let orig = [card,card2,card3];
      let target = [card3,card2,card];
      let ranked = cards.Card.rankCardsByValue(orig.slice()); // pass a copy, just in case
      for(let i = 0; i < target.length; i++) {
        expect(target[i].value).toEqual(ranked[i].value);
      }
    });
  });
  describe("#findMaxValueCard()", function() {
    test("empty stack should return null", function() {
      let maxCard = cards.Card.findMaxValueCard([]);
      expect(maxCard).toEqual(null);
    });
    test("stack of 1 card returns the value of that card", function() {
      let card = new cards.Card(1);
      let maxCard = cards.Card.findMaxValueCard([card]);
      expect(maxCard.id).toEqual(card.id);
    });
    test("stack of 2 cards (1,2) should return the ID of the higher value card (2)", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let maxCard = cards.Card.findMaxValueCard([card,card2]);
      expect(maxCard.id).toEqual(card2.id);
    });
    test("stack of 3 cards (1,2,3) should return the ID of the highest value card (3)", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      let maxCard = cards.Card.findMaxValueCard([card,card2,card3]);
      expect(maxCard.id).toEqual(card3.id);
    });
  });
  describe("#getMaxPlayerStack()", function() {
    test("check no stacks", function() {
      expect(cards.Card.getMaxPlayerStack([])).toEqual(null);
    });
    test("check empty stack", function() {
      expect(cards.Card.getMaxPlayerStack([[]])).toEqual(0);
    });
    test("check one stack", function() {
      let card = new cards.Card(1);
      expect(cards.Card.getMaxPlayerStack([[card]])).toEqual(0);
    });
    test("check two stacks", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      expect(cards.Card.getMaxPlayerStack([[],[]])).toEqual(0);
      expect(cards.Card.getMaxPlayerStack([[card],[card2]])).toEqual(1);
      expect(cards.Card.getMaxPlayerStack([[],[card,card2]])).toEqual(1);
      expect(cards.Card.getMaxPlayerStack([[card2,card2],[card3]])).toEqual(0);
    });
    test("check three stacks", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      expect(cards.Card.getMaxPlayerStack([[],[],[]])).toEqual(0);
      expect(cards.Card.getMaxPlayerStack([[card3],[card2],[card]])).toEqual(0);
      expect(cards.Card.getMaxPlayerStack([[card],[card3],[card2]])).toEqual(1);
      expect(cards.Card.getMaxPlayerStack([[card],[card2],[card3]])).toEqual(2);
      expect(cards.Card.getMaxPlayerStack([[],[card],[card2,card3]])).toEqual(2);
    });
    test("check five stacks", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      let card4 = new cards.Card(4);
      let card5 = new cards.Card(5);
      expect(cards.Card.getMaxPlayerStack([[],[card],[card,card2,card3],[card4,card5],[]])).toEqual(3);
    });
  });
  describe("#rankPlayerStacks()", function() {
    test("check no stacks", function() {
      expect(cards.Card.rankPlayerStacks([]).length).toEqual(0);
    });
    test("check empty stack", function() {
      let rankings = cards.Card.rankPlayerStacks([[]]); 
      expect(rankings[0].idx).toEqual(0);
    });
    test("check one stack", function() {
      let card = new cards.Card(1);
      let rankings = cards.Card.rankPlayerStacks([[card]]); 
      expect(rankings[0].idx).toEqual(0);
    });
    test("check two stacks", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      let rankings = cards.Card.rankPlayerStacks([[card],[card2]]); 
      expect(rankings[0].idx).toEqual(1);
      expect(rankings[1].idx).toEqual(0);
      rankings = cards.Card.rankPlayerStacks([[],[card,card2]]);
      expect(rankings[0].idx).toEqual(1);
      expect(rankings[1].idx).toEqual(0);
      rankings = cards.Card.rankPlayerStacks([[card2,card2],[card3]]);
      expect(rankings[0].idx).toEqual(0);
      expect(rankings[1].idx).toEqual(1);
    });
    test("check three stacks", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      let rankings = cards.Card.rankPlayerStacks([[card3],[card2],[card]]); 
      expect(rankings[0].idx).toEqual(0);
      expect(rankings[1].idx).toEqual(1);
      expect(rankings[2].idx).toEqual(2);
      rankings = cards.Card.rankPlayerStacks([[card],[card3],[card2]]);
      expect(rankings[0].idx).toEqual(1);
      expect(rankings[1].idx).toEqual(2);
      expect(rankings[2].idx).toEqual(0);
      rankings = cards.Card.rankPlayerStacks([[card],[card2],[card3]]);
      expect(rankings[0].idx).toEqual(2);
      expect(rankings[1].idx).toEqual(1);
      expect(rankings[2].idx).toEqual(0);
      rankings = cards.Card.rankPlayerStacks([[card],[],[card2,card3]]);
      expect(rankings[0].idx).toEqual(2);
      expect(rankings[1].idx).toEqual(0);
      expect(rankings[2].idx).toEqual(1);
    });
    test("check five stacks", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      let card4 = new cards.Card(4);
      let card5 = new cards.Card(5);
      let rankings = cards.Card.rankPlayerStacks([[],[card],[card,card2,card3],[card4,card5],[]]); 
      expect(rankings[0].idx).toEqual(3);
      expect(rankings[1].idx).toEqual(2);
      expect(rankings[2].idx).toEqual(1);
    });
  });
  describe("#sumStack()", function() {
    test("empty stacks should return 0", function() {
      expect(cards.Card.sumStack([])).toEqual(0);
    });
    test("stacks of one card should return the card's value", function() {
      let card = new cards.Card(4);
      expect(cards.Card.sumStack([card])).toEqual(4);
    });
    test("stacks of 2 cards (examples: (1,5) and (2,4)) should return the sum of the 2 cards (6)", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(5);
      expect(cards.Card.sumStack([card,card2])).toEqual(6);
      card = new cards.Card(2);
      card2 = new cards.Card(4);
      expect(cards.Card.sumStack([card,card2])).toEqual(6);
    });
    test("sum of 5 cards (1, 2, 3, 4, 5) should return 15", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      let card4 = new cards.Card(4);
      let card5 = new cards.Card(5);
      expect(cards.Card.sumStack([card,card2,card3,card4,card5])).toEqual(15);
    });
  });
});
