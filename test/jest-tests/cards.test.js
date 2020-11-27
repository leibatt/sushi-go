import * as cards from "../../cards";

describe("ChopsticksCard", function() {
  test("Check type is 'chopsticks'", function() {
    let card = new cards.ChopsticksCard();
    expect(cards.ChopsticksCard.typeName).toEqual("chopsticks");
    expect(card.type).toEqual(cards.ChopsticksCard.typeName);
  });
  test("#isRelevantStack should only work for empty stacks",function() {
    let ccard = new cards.ChopsticksCard();
    let ccard2 = new cards.ChopsticksCard();
    let pcard = new cards.PuddingCard();
    expect(ccard.isValidStack([])).toBeTruthy();
    expect(ccard.isValidStack([ccard2])).toBeFalsy();
    expect(ccard.isValidStack([ccard2,pcard])).toBeFalsy();
  });

});

describe("PuddingCard", function() {
  test("Check type is 'pudding'", function() {
    let card = new cards.PuddingCard();
    expect(cards.PuddingCard.typeName).toEqual("pudding");
    expect(card.type).toEqual(cards.PuddingCard.typeName);
  });
  test("#isValidStack only allows Pudding cards",function() {
    let pcard = new cards.PuddingCard();
    let allPudding = [];
    for(let i = 0; i < 5; i++) {
      allPudding.push(new cards.PuddingCard());
      expect(pcard.isValidStack(allPudding)).toBeTruthy();
    }
    allPudding.push(new cards.Card());
    expect(pcard.isValidStack(allPudding)).toBeFalsy();
  });
  test("#score is sum of PuddingCard values",function() {
    let pcard = new cards.PuddingCard();
    let pstack = [];
    for(let i = 1; i <= 3; i++) {
      pstack.push(new cards.PuddingCard(i));
      expect(pcard.score(pstack)).toEqual(i);
    }
  });
});

describe("MakiCard", function() {
  test("Check type is 'maki'", function() {
    let card = new cards.MakiCard();
    expect(cards.MakiCard.typeName).toEqual("maki");
    expect(card.type).toEqual(cards.MakiCard.typeName);
  });
  test("#isValidStack only allows Maki cards",function() {
    let mcard = new cards.MakiCard();
    let allMaki = [];
    for(let i = 0; i < 5; i++) {
      allMaki.push(new cards.MakiCard());
      expect(mcard.isValidStack(allMaki)).toBeTruthy();
    }
    allMaki.push(new cards.Card());
    expect(mcard.isValidStack(allMaki)).toBeFalsy();
  });
  test("#score is sum of MakiCard values",function() {
    let mcard = new cards.MakiCard();
    let mstack = [];
    for(let i = 1, currScore = i; i <= 3; i++, currScore += i) {
      mstack.push(new cards.MakiCard(i));
      expect(mcard.score(mstack)).toEqual(currScore);
    }
  });
});

describe("SashimiCard", function() {
  test("Check type is 'sashimi'", function() {
    let card = new cards.SashimiCard();
    expect(cards.SashimiCard.typeName).toEqual("sashimi");
    expect(card.type).toEqual(cards.SashimiCard.typeName);
  });
  // NOTE: uses default isRelevantStack
  test("#isValidStack only allows three Sashimi or less",function() {
    let scard = new cards.SashimiCard();
    let allSashimi = [];
    for(let i = 0; i < 3; i++) {
      allSashimi.push(new cards.SashimiCard());
      expect(scard.isValidStack(allSashimi)).toBeTruthy();
    }
    allSashimi.push(new cards.SashimiCard());
    expect(scard.isValidStack(allSashimi)).toBeFalsy();
  });
  test("#score is ten for exactly three Sashimi, zero otherwise",function() {
    let scard = new cards.SashimiCard();
    let allSashimi = [];
    let expectedScores = [0,0,0,10,0];
    while(allSashimi.length < expectedScores.length) {
      expect(scard.score(allSashimi)).toEqual(expectedScores[allSashimi.length]);
      allSashimi.push(new cards.SashimiCard());
    }
  });
});

describe("TempuraCard", function() {
  test("Check type is 'tempura'", function() {
    let card = new cards.TempuraCard();
    expect(cards.TempuraCard.typeName).toEqual("tempura");
    expect(card.type).toEqual(cards.TempuraCard.typeName);
  });
  // NOTE: uses default isRelevantStack
  test("#isValidStack only allows two Tempura or less",function() {
    let tcard = new cards.TempuraCard();
    let allTempura = [];
    for(let i = 0; i < 2; i++) {
      allTempura.push(new cards.TempuraCard());
      expect(tcard.isValidStack(allTempura)).toBeTruthy();
    }
    allTempura.push(new cards.TempuraCard());
    expect(tcard.isValidStack(allTempura)).toBeFalsy();
  });
  test("#score is five for exactly two Tempura, zero otherwise",function() {
    let tcard = new cards.TempuraCard();
    let allTempura = [];
    let expectedScores = [0,0,5,0];
    while(allTempura.length < expectedScores.length) {
      expect(tcard.score(allTempura)).toEqual(expectedScores[allTempura.length]);
      allTempura.push(new cards.TempuraCard());
    }
  });
});

describe("DumplingCard", function() {
  test("Check type is 'dumpling'", function() {
    let card = new cards.DumplingCard();
    expect(cards.DumplingCard.typeName).toEqual("dumpling");
    expect(card.type).toEqual(cards.DumplingCard.typeName);
  });
  // NOTE: uses default isRelevantStack
  test("#isValidStack only allows five dumplings or less",function() {
    let dcard = new cards.DumplingCard();
    let allDumplings = [];
    for(let i = 0; i < 5; i++) {
      allDumplings.push(new cards.DumplingCard());
      expect(dcard.isValidStack(allDumplings)).toBeTruthy();
    }
    allDumplings.push(new cards.DumplingCard());
    expect(dcard.isValidStack(allDumplings)).toBeFalsy();
  });
  test("#score scale is correct for up to five dumplings, zero otherwise",function() {
    let dcard = new cards.DumplingCard();
    let allDumplings = [];
    let expectedScores = [0,1,3,6,10,15,0];
    while(allDumplings.length < expectedScores.length) {
      expect(dcard.score(allDumplings)).toEqual(expectedScores[allDumplings.length]);
      allDumplings.push(new cards.DumplingCard());
    }
  });
});

describe("WasabiCard", function() {
  test("Check type is 'wasabi'", function() {
    let card = new cards.WasabiCard();
    expect(cards.WasabiCard.typeName).toEqual("wasabi");
    expect(card.type).toEqual(cards.WasabiCard.typeName);
  });
  // NOTE: wasabi reuses the NigiriCard score, isValidStack, and isRelevantStack functions
});

describe("All NigiriCards", function() {
  describe("NigiriCard", function() {
    test("Check type is 'nigiri'", function() {
      let card = new cards.NigiriCard();
      expect(cards.NigiriCard.typeName).toEqual("nigiri");
      expect(card.type).toEqual(cards.NigiriCard.typeName);
    });
    test("#isRelevantStack only Wasabi and Nigiri cards are relevant", function() {
      let ncard = new cards.NigiriCard(1);
      let ncard2 = new cards.NigiriCard(2);
      let wcard = new cards.WasabiCard();
      let card = new cards.Card(1);
      expect(ncard.isRelevantStack([])).toBeTruthy();
      expect(ncard.isRelevantStack([ncard2])).toBeTruthy();
      expect(ncard.isRelevantStack([wcard])).toBeTruthy();
      expect(ncard.isRelevantStack([card])).toBeFalsy();
    });
    test("#isValidStack No more than one Nigiri card and/or Wasabi card per stack", function() {
      let ncard = new cards.NigiriCard(1);
      let ncard2 = new cards.NigiriCard(2);
      let ncard3 = new cards.NigiriCard(3);
      let wcard = new cards.WasabiCard();
      let wcard2 = new cards.WasabiCard();
      expect(ncard.isValidStack([])).toBeTruthy();
      expect(ncard.isValidStack([ncard2])).toBeTruthy();
      expect(ncard.isValidStack([wcard])).toBeTruthy();
      expect(ncard.isValidStack([ncard2,wcard])).toBeTruthy();
      expect(ncard.isValidStack([ncard2,ncard3])).toBeFalsy();
      expect(ncard.isValidStack([wcard,wcard2])).toBeFalsy();
    });
    describe("#score",function() {
      test("Check that stacks with one nigiri receive score equal to card value", function() {
        let ncard = new cards.NigiriCard(1);
        let ncard2 = new cards.NigiriCard(2);
        let ncard3 = new cards.NigiriCard(3);
        expect(ncard.score([ncard2])).toEqual(ncard2.value);
        expect(ncard.score([ncard3])).toEqual(ncard3.value);
      });
      test("Check that stacks with one nigiri and one wasabi receive score equal to card value x 3", function() {
        let ncard = new cards.NigiriCard(1);
        let ncard2 = new cards.NigiriCard(2);
        let ncard3 = new cards.NigiriCard(3);
        let wcard = new cards.WasabiCard();
        expect(ncard2.score([ncard,wcard])).toEqual(3*ncard.value);
        expect(ncard.score([ncard2,wcard])).toEqual(3*ncard2.value);
        expect(ncard.score([ncard3,wcard])).toEqual(3*ncard3.value);
      });
      test("Check that stacks with more than one nigiri receive a score of zero", function() {
        let ncard = new cards.NigiriCard(1);
        let ncard2 = new cards.NigiriCard(2);
        let ncard3 = new cards.NigiriCard(3);
        expect(ncard.score([ncard2,ncard3])).toEqual(0);
      });
      test("Check that stacks with zero nigiri receive a score of zero", function() {
        let ncard = new cards.NigiriCard(1);
        let ncard2 = new cards.NigiriCard(2);
        let card = new cards.Card(1);
        let wcard = new cards.WasabiCard();
        expect(ncard.score([card])).toEqual(0);
        expect(ncard.score([wcard])).toEqual(0);
        expect(ncard.score([card,ncard2])).toEqual(0);
      });
    });
  });
  describe("EggNigiriCard", function() {
    test("Check type is 'nigiri', name is 'egg', and value=1", function() {
      let card = new cards.EggNigiriCard();
      expect(card.type).toEqual(cards.NigiriCard.typeName);
      expect(card.name).toEqual("egg");
      expect(card.value).toEqual(1);
    });
  });
  describe("SalmonNigiriCard", function() {
    test("Check type is 'nigiri', name is 'salmon', and value=2", function() {
      let card = new cards.SalmonNigiriCard();
      expect(card.type).toEqual(cards.NigiriCard.typeName);
      expect(card.name).toEqual("salmon");
      expect(card.value).toEqual(2);
    });
  });
  describe("SquidNigiriCard", function() {
    test("Check type is 'nigiri', name is 'squid', and value=3", function() {
      let card = new cards.SquidNigiriCard();
      expect(card.type).toEqual(cards.NigiriCard.typeName);
      expect(card.name).toEqual("squid");
      expect(card.value).toEqual(3);
    });
  });
});

describe("Card", function() {
  test("#score is zero (cannot be scored)",function() {
    let card = new cards.Card(1);
    let stack = [];
    for(let i = 1; i <= 3; i++) {
      stack.push(new cards.Card(1));
      expect(card.score(stack)).toEqual(null);
    }
  });
  describe("#existsInStack", function() {
    test("should be true for stacks with 1+ cards of same the type", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
      expect(card.existsInStack([card2,card3])).toBeTruthy();
      expect(card2.existsInStack([card,card3])).toBeTruthy();
      expect(card3.existsInStack([card,card2])).toBeTruthy();
    });
    test("should be false for stacks with no matching card types", function() {
      let card = new cards.ChopsticksCard();
      let card2 = new cards.MakiCard(2);
      let card3 = new cards.EggNigiriCard();
      expect(card.existsInStack([card2,card3])).toBeFalsy();
      expect(card2.existsInStack([card,card3])).toBeFalsy();
      expect(card3.existsInStack([card,card2])).toBeFalsy();
    });
  });
  describe("#isRelevantStack()", function() {
    test("empty stack should be relevant", function() {
      let card = new cards.Card(1);
      card.type = "test";
      expect(card.isRelevantStack([])).toBeTruthy();
    });
    test("cards of all the same type should be relevant", function() {
      let card = new cards.Card(1);
      let card2 = new cards.Card(2);
      let card3 = new cards.Card(3);
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
