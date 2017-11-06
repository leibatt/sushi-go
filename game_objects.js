function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/********* Begin Cards ***********/
class Card {
  constructor(value=null) {
    this.id = uuidv4();
    this.type = null; // override
    this.name = null; // override
    this.value = value;
  }

  // assuming the stack is valid
  score(stack) { // override
    return -1;
  }

  isRelevantStack(stack) {
    var self = this;
    return stack.every(card => card.type === self.type);
  }

  isValidStack(stack) {
    return this.isRelevantStack(stack);
  }

  static findMaxValueCard(stack) {
    if(stack.length === 0) {
      return null;
    }
    var currCard = null;
    for(var i = 0; i < stack.length; i++) {
      var card = stack[i];
      if(currCard === null || card !== null && currCard.value < card.value) {
        currCard = card;
      }
    }
    return currCard;
  }

  // given a list of valid stacks, find the player (i.e., stack index) with the largest sum
  static getMaxPlayerStack(stacks) {
    if(stacks.length === 0) {
      return null;
    }
    var currSum = null;
    var idx = 0;
    for(var i = 0; i < stacks.length; i++) {
      var sum = this.sumStack(stacks[i]);
      if(currSum === null || sum > currSum) {
        idx = i;
        currSum = sum;
      }
    }
    return idx;
  }

  static rankPlayerStacks(stacks) {
    var objs = [];
    var self = this;
    stacks.forEach(stack => objs.push({"stack":stack,"sum":self.sumStack(stack),"idx":objs.length}));
    return stacks.sort((objA,objB) => objB.sum - objA.sum); // sort descending
  }

  static sumStack(stack) {
    return stack.reduce((sum,card) => sum + card.value,0);
  }

  // assigns scores based on the maximum values achieved for the given player stacks
  // has optional flag to also penalize last place with a bad score
  static scoreStacksByRank(stacks,penalizeMin=false) {
    var rankings = rankPlayerStacks(stacks);
    // check for at least 2 players
    if(stacks.length === 1) {
      return [0];
    }
    var scores = [];
    while(scores.length < rankings.length) { // scores start at 0
      scores.push([0]);
    }
    // check for first place tie
    var maxScore = rankings[0].sum;
    var ties = [rankings[0].idx];
    for(var i = 1; i < rankings.length; i++) {
      if(rankings[i].sum === maxScore) {
        ties.push(rankings[i].idx);
      } else {
        break; // already sorted, no need to continue search
      }
    }
    if(ties.length > 1) { // found ties
      if(ties.length === rankings.length) {
        return scores; // no change if all players have the same amount of pudding
      }
      var divided_score = parseInt(6 / ties.length);
      for(var i = 0; i < ties.length; i++) {
        scores[ties[i]] = divided_score;
      }
      return scores;
    }
    // no first place ties
    scores[rankings[0].idx] = 6;
    // check for second place ties
    maxScore = rankings[1].sum;
    ties = [rankings[1].idx];
    for(var i = 2; i < rankings.length; i++) {
      if(rankings[i].sum === maxScore) {
        ties.push(rankings[i].idx);
      } else {
        break; // already sorted, no need to continue search
      }
    }
    if(ties.length > 1) { // found ties
      var divided_score = parseInt(3 / ties.length);
      for(var i = 0; i < ties.length; i++) {
        scores[ties[i]] = divided_score;
      }
      return scores;
    }
    // else no ties, first and second place get the spoils
    scores[rankings[1].idx] = 3;


    if(penalizeMin) { // for pudding
      minScore = rankings[rankings.length-1].sum;
      var ties = [rankings[rankings.length-1].idx];
      for(var i = rankings.length-2; i > 0; i--) {
        if(rankings[i].sum === minScore) {
          ties.push(rankings[i].idx);
        } else {
          break; // already sorted, no need to continue search
        }
      }
      if(ties.length > 1) { // found ties
        var divided_score = parseInt(-6 / ties.length);
        for(var i = 0; i < ties.length; i++) {
          scores[ties[i]] = divided_score;
        }
        return scores;
      }
      // no last place ties
      scores[rankings[rankings.length-1].idx] = -6;
    }
    return scores;
  }
}

// TODO: finish
class ChopsticksCard extends Card {
  constructor(value=null) {
    super(value);
    this.type = "chopsticks";
    this.name = "chopsticks";
  }

  score(stack) {
    return 0;
  }
}

class PuddingCard extends Card {
  constructor(value=null) {
    super(value);
    this.type = "pudding";
    this.name = "pudding";
  }

  score(stack) {
    return 0;
  }
}

class MakiCard extends Card {
  constructor(value=null) {
    super(value);
    this.type = "maki";
    this.name = "maki";
  }
}

class DumplingCard extends Card {
  constructor(value=null) {
    super(value);
    this.type = "dumpling";
    this.name = "dumpling";
  }

  // assuming the stack is valid
  score(stack) {
    return {
      0:0,
      1:1,
      2:3,
      3:6,
      4:10,
      5:15
    }[stack.length];
  }

  isValidStack(stack) {
    return this.isRelevantStack(stack) && stack.length <= 5; // at most 5 dumplings in the stack
  }
}

class TempuraCard extends Card {
  constructor(value=null) {
    super(value);
    this.type = "tempura";
    this.name = "tempura";
  }

  // assuming the stack is valid
  score(stack) {
    if(stack.length == 2) {
      return 5;
    } else {
      return 0;
    }
  }

  isValidStack(stack) {
    return this.isRelevantStack(stack) && stack.length <= 2; // at most 2 tempura in the stack
  }
}

class SashimiCard extends Card {
  constructor(value=null) {
    super(value);
    this.type = "sashimi";
    this.name = "sashimi";
  }

  // assuming the stack is valid
  score(stack) {
    if(stack.length === 3) {
      return 10;
    } else {
      return 0;
    }
  }

  isValidStack(stack) {
    return this.isRelevantStack(stack) && stack.length <= 3; // at most 3 sashimi in the stack
  }
}

class WasabiCard extends Card {
  constructor(value=null) {
    super(value);
    this.type = "wasabi";
    this.name = "wasabi";
  }

  // assuming the stack is valid
  score(stack) {
    return 0;
  }

  isValidStack(stack) {
    return super.isRelevantStack(stack) && stack.length === 1; // only consider the case with 1 wasabi
  }
}

class NigiriCard extends Card {
  constructor(value=null) {
    super(value);
    this.type = "nigiri";
    this.name = null; // override
  }

  // assuming the stack is valid
  score(stack) {
    var self = this;
    if(stack.some(card => card.type === self.type)) { // we have some cards to score
      if(stack.some(card => card.type === "wasabi")) { // there is wasabi
        var maxCard = this.findMaxValueCard(stack);
        if(maxCard.value !== null) {
          return 3 * maxCard.value;
        } else { // why is everything null?
          return -1;
        }
      } else { // just return the total scores of the nigiri cards
        return this.sumStack(stack);
      }
    } else {
      return 0;
    }
  }

  isRelevantStack(stack) {
    var wasabi_count = 0;
    var nigiri_count = 0;
    for(var i = 0; i < stack.length; i++) {
      var card = stack[i];
      if(card.type === "wasabi") {
        wasabi_count++;
        if(wasabi_count > 1) { // validity rule: at most 1 wasabi in the stack
          return false;
        }
      }
      else if(card.type === this.type) {
        nigiri_count++;
        if(wasabi_count === 1 && nigiri_count > 1) { // validity rule: only one nigiri can be paired with one wasabi
          return false;
        }
      }
    }
    return (wasabi_count+nigiri_count) === stack.length;
  }
}

class SquidNigiriCard extends NigiriCard {
  constructor(value=null) {
    super(3); // hardcode the value
    this.name = "squid";
  }
}

class SalmonNigiriCard extends NigiriCard {
  constructor(value=null) {
    super(2); // hardcode the value
    this.name = "salmon";
  }
}

class EggNigiriCard extends NigiriCard {
  constructor(value=null) {
    super(1); // hardcode the value
    this.name = "egg";
  }
}

/********* End Cards ***********/

class Player {
  constructor(hand) {
    this.hand = hand;
  }
}

class Hand {
  constructor(cards=null) {
    if(cards !== null) {
      this.cards = cards;
    } else {
      this.cards = [];
    }
  }
}

class Tableau {
  constructor() {
    this.stacks = [];
  }

  computeScore() {
  }

  computeStackScore() {
  }

  addCard(card,stack=null) {
  }

  findStack(card) {
  }
}

class Deck {

}

module.exports = {
  Player:Player,
  Tableau:Tableau,
  Hand:Hand,
  Card:Card,
  ChopsticksCard:ChopsticksCard,
  DumplingCard:DumplingCard,
  SashimiCard:SashimiCard,
  TempuraCard:TempuraCard,
  NigiriCard:NigiriCard,
  SquidNigiriCard:SquidNigiriCard,
  SalmonNigiriCard:SalmonNigiriCard,
  EggNigiriCard:NigiriCard,
  MakiCard:MakiCard,
  PuddingCard:PuddingCard
};
