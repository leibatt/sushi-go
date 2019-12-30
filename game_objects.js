function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

function sum(arr) {
  return arr.reduce((acc,el) => acc + el,0);
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/********* Begin Cards ***********/
class Card {
  constructor(value=null) {
    this.id = uuidv4();
    this.type = null; // override
    this.name = null; // override
    this.value = value;
  }

  display() {
    return "(card "+this.type+" "+this.name+" "+this.value+")";
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

  static rankCardsByValue(stack) {
    return stack.slice().sort((c1,c2) => c2.value-c1.value);
  }

  static findMaxValueCard(stack) {
    if(stack.length === 0) {
      return null;
    }
    return this.rankCardsByValue(stack)[0];
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
    return objs.sort((objA,objB) => objB.sum - objA.sum); // sort descending
  }

  static sumStack(stack) {
    return stack.reduce((sum,card) => sum + card.value,0);
  }

  // assigns scores based on the maximum values achieved for the given player stacks
  // has optional flag to also penalize last place with a bad score
  static scoreStacksByRank(stacks,secondPlace=true,penalizeMin=false) {
    var rankings = Card.rankPlayerStacks(stacks);

    if(stacks.length === 0) {
      return [];
    }

    // check for at least 2 players
    if(stacks.length === 1) {
      return [0];
    }
    var scores = [];
    while(scores.length < rankings.length) { // scores start at 0
      scores.push(0);
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
    if(secondPlace) {
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
    }
    if(penalizeMin) { // penalizeMin=true,for pudding
      var minScore = rankings[rankings.length-1].sum;
      var ties = [rankings[rankings.length-1].idx];
      for(var i = rankings.length-2; i > 0; i--) {
        if(rankings[i].sum === minScore) {
          ties.push(rankings[i].idx);
        } else {
          break; // already sorted, no need to continue search
        }
      }
      if(ties.length === rankings.length) {
        return scores; // no change if all players have the same amount of pudding
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
    return 0; // score should be done compared to everyone else
  }
}

class MakiCard extends Card {
  constructor(value=null) {
    super(value);
    this.type = "maki";
    this.name = "maki";
  }

  // assuming the stack is valid
  // only invoke at the end of the round to calculate the maximum maki score
  score(stack) {
    var self = this;
    //console.log("calling scoring method for MakiCard class");
    //console.log([stack,"is valid stack?",this.isValidStack(stack),"score?",stack.reduce((acc,c) => c.type === self.type ? c.value + acc : acc,0)]);
    if(this.isValidStack(stack)) {
      return stack.reduce((acc,c) => c.type === self.type ? c.value + acc : acc,0);
    } else {
      return 0; // score should be done compared to everyone else
    }
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
    if(this.isValidStack(stack)) {
      return {
        0:0,
        1:1,
        2:3,
        3:6,
        4:10,
        5:15
      }[stack.length];
    } else {
      return 0; // not a valid dumpling stack
    }
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
    if(this.isValidStack(stack) && stack.length === 2) {
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
    if(this.isValidStack(stack) && stack.length === 3) {
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
    if(this.isValidStack(stack)) {
      var self = this;
      if(stack.some(card => card.name === self.name)) { // the card is of the correct nigiri type
        if(stack.some(card => card.type === "wasabi")) { // there is wasabi
          return 3 * this.value;
        } else {
          return this.value;
        }
      }
    }
    return 0;
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

    // ignore the valid wasabi stack case (exactly 1 wasabi card in the stack, and nothing else)
    return (nigiri_count+wasabi_count) === stack.length // nigiri and wasabi only
      && wasabi_count <= 1 && nigiri_count <= 1;
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
  constructor(discard,name=null) {
    if(name) {
      this.name = name;
    } else {
      this.name = uuidv4();
    }
    this.discard = discard;
    this.hand = [];
    this.tableau = new Tableau(discard);
  }

  display() {
    return "(player "+[this.name,"(hand ["+ this.hand.map((card) => card.display()).join(", ")+"])",this.tableau.display()].join(", ")+")";
  }

  getName() {
    return this.name;
  }

  getHand() {
    return this.hand;
  }

  setHand(hand) {
    this.hand = hand;
  }

  getTableau() {
    return this.tableau;
  }

  moveCardToTableau(cardId,stackId) {
    var card = this.hand.splice(cardId, 1 )[0];
    this.tableau.addToStack(card,stackId);
  }

  clearTableau() {
    this.tableau.clear();
  }
}

/*
class Hand {
  constructor(cards=null) {
    if(cards !== null) {
      this.cards = cards;
    } else {
      this.cards = [];
    }
  }
  
  display() {
    return "(hand " + this.cards.join(", ") + ")";
  }

  addCard(card) {
    this.cards.push(card);
  }

  getCards() {
    return this.cards;
  }
}
*/

class Tableau {
  constructor(discard) {
    this.stacks = [];
    this.discard = discard;
    // dummies, just for scoring
    this.scoringCards = [new EggNigiriCard(),new SalmonNigiriCard(),new SquidNigiriCard(), new WasabiCard(), new SashimiCard(), new TempuraCard(), new DumplingCard()];
    // require special scoring: new MakiCard(), new PuddingCard()
  }

  addToStack(card,stackId=null) {
    console.log(card.display(),stackId);
    if(this.stacks.length === 0 || stackId && stackId < 0) { // make a new stack
      this.stacks.push([card]);
      console.log("got here1");
    } else if(stackId >= 0 && stackId < this.stacks.length) { // valid stackId was passed
      this.stacks[stackId].push(card);
      console.log("got here2");
    } else { // something bad happened
      console.log("got here3");
      throw ["did not add card to stack! ",card.display(),stackId].join(" ");
    }
  }

  computeScore() {
    var score = 0;
    for(var i = 0; i < this.stacks.length; i++) {
      var stack = this.stacks[i];
      score += this.computeStackScore(stack);
    }
    return score;
  }

  computeStackScoreForCardType(scoringCard,stack) {
    return scoringCard.score(stack);
  }

  computeMakiScore() {
    return this.stacks.reduce((acc,stack) => acc + this.computeStackScoreForCardType(new MakiCard(),stack),0);
  }

  // compute the first valid score found for this stack
  computeStackScore(stack) {
    //console.log("executing computeStackScore");
    for(var i = 0; i < this.scoringCards.length; i++) {
      //console.log(this.scoringCards[i],this.scoringCards[i].score(stack));
      //var score = this.scoringCards[i].score(stack);
      var score = this.computeStackScoreForCardType(this.scoringCards[i],stack);
      if(score > 0) {
        return score;
      } else if (score < 0) {
        throw "negative score: " + score;
      } // otherwise score is zero, ignore
    }
    return 0; // by default the score is zero
  }

  // add the card to the given stack ID
  addCard(card,stack) {
    this.stacks[i].push(card);
  }

  // find all stacks that this card could belong to
  findValidStacks(card) {
    if(this.stacks.length == 0) {
      return null;
    }

    var found = [];
    for(var i = 0; i < this.stacks.length; i++) {
      var stack = this.stacks[i];
      for(var j = 0; j < stack.length; j++) {
        var c = stack[j];
        if(card.type === c.type) {
          found.push(i);
          break;
        }
      }
    }
    return found;
  }

  display() {
    var stackDisplays = [];
    for(var i = 0; i < this.stacks.length; i++) {
      var stack = this.stacks[i];
      stackDisplays.push("(stack ["+stack.map((card) => card.display()).join(", ")+"])");
    }
    return "(tableau ["+ stackDisplays.join(", ") + "])";
  }

  clear() {
    // move tableau to discard pile
    for(var i = 0; i < this.stacks.length; i++) {
      var stack = this.stacks[i];
      for(var j = 0; j < stack.length; j++) {
        var card = stack[j];
        this.discard.push(card);
      }
    }
    this.stacks = [];
  }
}

/*
* From BGG:
* 108 cards (57.5x88.5mm)
* 14x Tempura
* 14x Sashimi
* 14x Dumpling
* 12x 2 Maki
* 8x 3 Maki
* 6x 1 Maki
* 10x Salmon Sushi (Nigiri)
* 5x Squid Sushi (Nigiri)
* 5x Omelet Sushi (Nigiri)
* 10x Dessert (pudding)
* 6x Wasabi
* 4x Chopsticks
*/

class Deck {
  constructor() {
    this.cards = [];
    //this.makeStandardDeck();
    this.makeTestDeck();
    this.shuffle();
  }

  shuffle() {
    shuffle(this.cards);
  }

  // removes and returns the *last* card in the array!
  drawCard() {
    return this.cards.pop();
  }

  makeTestDeck() {
/*
    // 14x Tempura
    for(var i = 0; i < 14; i++) {
      this.cards.push(new TempuraCard());
    }

    // 14x Sashimi
    for(var i = 0; i < 14; i++) {
      this.cards.push(new SashimiCard());
    }

    // 14x Dumpling
    for(var i = 0; i < 14; i++) {
      this.cards.push(new DumplingCard());
    }

    // 10x Salmon Nigiri
    for(var i = 0; i < 10; i++) {
      this.cards.push(new SalmonNigiriCard());
    }

    // 6x Wasabi
    for(var i = 0; i < 6; i++) {
      this.cards.push(new WasabiCard());
    }

    // 5x Squid Nigiri
    for(var i = 0; i < 5; i++) {
      this.cards.push(new SquidNigiriCard());
    }

    // 5x Egg Nigiri
    for(var i = 0; i < 5; i++) {
      this.cards.push(new EggNigiriCard());
    }
    // 12x 2 Maki
    for(var i = 0; i < 12; i++) {
      this.cards.push(new MakiCard(2));
    }

    // 8x 3 Maki
    for(var i = 0; i < 8; i++) {
      this.cards.push(new MakiCard(3));
    }
*/

    // 6x 1 Maki
    for(var i = 0; i < 60; i++) {
      this.cards.push(new MakiCard(1));
    }
  }

  makeStandardDeck() {
    // 14x Tempura
    for(var i = 0; i < 14; i++) {
      this.cards.push(new TempuraCard());
    }

    // 14x Sashimi
    for(var i = 0; i < 14; i++) {
      this.cards.push(new SashimiCard());
    }

    // 14x Dumpling
    for(var i = 0; i < 14; i++) {
      this.cards.push(new DumplingCard());
    }

    // 12x 2 Maki
    for(var i = 0; i < 12; i++) {
      this.cards.push(new MakiCard(2));
    }

    // 8x 3 Maki
    for(var i = 0; i < 8; i++) {
      this.cards.push(new MakiCard(3));
    }

    // 6x 1 Maki
    for(var i = 0; i < 6; i++) {
      this.cards.push(new MakiCard(1));
    }

    // 10x Salmon Nigiri
    for(var i = 0; i < 10; i++) {
      this.cards.push(new SalmonNigiriCard());
    }

    // 5x Squid Nigiri
    for(var i = 0; i < 5; i++) {
      this.cards.push(new SquidNigiriCard());
    }

    // 5x Egg Nigiri
    for(var i = 0; i < 5; i++) {
      this.cards.push(new EggNigiriCard());
    }

    // 10x Pudding
    for(var i = 0; i < 10; i++) {
      this.cards.push(new PuddingCard());
    }

    // 6x Wasabi
    for(var i = 0; i < 6; i++) {
      this.cards.push(new WasabiCard());
    }

    // 4x Chopsticks
    for(var i = 0; i < 4; i++) {
      this.cards.push(new ChopsticksCard());
    }
  }

  display() {
    return "(deck ["+this.cards.map((card) => card.display()).join(", ")+"])";
  }
}

class GameManager {

  // takes list of player names as input
  constructor(players=null,debug=false) {
    this.debug = debug; // are we in debugging mode?
    this.currentTurn = 0; // which player's turn is it?
    this.currentRound = 0; // which round is it?
    this.maxRounds = 3; // how many rounds are played?
    this.players = {};
    this.playerOrder = [];
    this.scores = {};
    this.discard = [];
    if(players) {
      players.forEach((name) => {
        this.createPlayer(name);
        this.playerOrder.push(name);
        this.scores[name] = [];
      });
    }
    this.deck = new Deck();
    this.assignHands();
  }

  displayGameState() {
    this.playerOrder.forEach((name) => {
      console.log(this.players[name].display());
    });
    console.log(this.deck.display());
    console.log(this.displayDiscard());
    console.log(this.displayScoresForCurrentRound());
  }

  displayDiscard() {
    return "(discard ["+this.discard.map((card) => card.display()).join(", ")+"])";
  }

  createPlayer(name=null) {
    var player = new Player(this.discard,name);
    this.players[player.getName()] = player;
    return player;
  }

  rotateHands() {
    if(this.playerOrder.length === 0) { // no players!
      return;
    }
    var prevHand = this.players[this.playerOrder[0]].getHand();
    for(var i = 1; i < this.playerOrder.length; i++) {
      var currHand = this.players[this.playerOrder[i]].getHand();
      //console.log([this.playerOrder[i],"prevHand","(hand ["+ prevHand.map((card) => card.display()).join(", ")+"])"]);
      //console.log([this.playerOrder[i],"currHand","(hand ["+ currHand.map((card) => card.display()).join(", ")+"])"]);
      this.players[this.playerOrder[i]].setHand(prevHand);
      //console.log([this.playerOrder[i],"new hand","(hand ["+ this.players[this.playerOrder[i]].getHand().map((card) => card.display()).join(", ")+"])"]);
      prevHand = currHand;
    }
    this.players[this.playerOrder[0]].setHand(prevHand);
  }

  assignHands() {
    var names = Object.keys(this.players);
    if(names.length < 2) {
      throw "Insufficient number of players: "+names.length;
    }
    var cardsPerPlayer = {
      2:10,
      3:9,
      4:8,
      5:7
    }[names.length];
    if(this.debug) {
      cardsPerPlayer = 2;
    }
    for(var i = 0; i < cardsPerPlayer; i++) {
      for(var j = 0; j < names.length; j++) {
        this.players[names[j]].getHand().push(this.deck.drawCard());
      }
    }
  }

  moveCardToTableau(playerName,cardId,stackId=null) {
    if(this.currentTurn === this.playerOrder.indexOf(playerName)) {
      this.players[playerName].moveCardToTableau(cardId,stackId);
      this.endTurn();
    } else {
      throw "not the current player's turn: " + ["playerName:",playerName,"current turn:",this.currentTurn,"index of playerName:",this.playerOrder.indexOf(playerName)].join(" ");
    }
  }

  // update whose turn it is
  endTurn() {
    this.currentTurn++;
    if(this.currentTurn >= this.playerOrder.length) {
      console.log("checking round end");
      if(this.checkRoundEnd()) { // round is over
        console.log("round is over");
        var res = this.endRound();
        console.log(res);
        if(this.checkGameEnd()) {
          console.log("game over!");
          console.log(this.displayFinalScores());
        } else {
          this.currentTurn = 0;
          this.playerOrder.forEach(n => this.players[n].clearTableau());
          this.assignHands();
        }
      } else {
        this.currentTurn = 0;
        this.rotateHands();
      }
    }
  }

  computeCurrentScores() {
    var scores = {};
    for(var i = 0; i < this.playerOrder.length; i++) {
      var playerName = this.playerOrder[i];
      scores[playerName] = this.players[this.playerOrder[i]].getTableau().computeScore();
    }
    return scores;
  }

  // for calculating scores for Maki
  computeMakiScores() {
    var items = [];
    this.playerOrder.forEach((n,i) => {
      items.push({
        "id": i,
        "name": n,
        "score": this.players[n].getTableau().computeMakiScore()
      });
    });
    items.sort((a,b) => b.score-a.score); // sort in reverse

    // prepare base scores
    var makiScores = {};
    items.forEach(i => { makiScores[i.name] = 0; });

    if(items.length > 1) {
      // search for ties
      var mt = 0;
      for(var i = 1; i < items.length; i++) {
        if(items[i].score < items[0].score) {
          break;
        } else {
          mt = i;
        }
      }
      if(mt > 0) { // ties for first place
        var pt = Math.floor(6 / (mt + 1));
        for(var i = 0; i <= mt; i++) {
          makiScores[items[i].name] = pt;
        }
      } else { // check ties for second place
        makiScores[items[0].name] = 6;
        mt = 1;
        for(i = 2; i < items.length; i++) {
          if(items[i].score < items[1].score) {
            break;
          } else {
            mt = i;
          }
        }
        var pt = Math.floor(3 / mt); // will always be 1
        for(var i = 1; i <= mt; i++) {
          makiScores[items[i].name] = pt;
        }
      }
    }
    return makiScores;
  }

  scoreRound() {
    var scores = this.computeCurrentScores();
    var makiScores = this.computeMakiScores();
    for(var i = 0; i < this.playerOrder.length; i++) {
      var playerName = this.playerOrder[i];
      console.log("player",playerName,"base score",scores[playerName],"maki score",makiScores[playerName]);
      this.scores[playerName].push(scores[playerName]+makiScores[playerName]);
    }
    //return JSON.parse(JSON.stringify(this.scores));
  }

  displayFinalScores() {
   var scoreStrings = [];
    for(var i = 0; i < this.playerOrder.length; i++) {
      var playerName = this.playerOrder[i];
      scoreStrings.push("(score "+[playerName, sum(this.scores[playerName])].join(", ")+")");
    }
    return "final scores : ["+scoreStrings.join(", ")+"]";
  }

  displayScoresForCurrentRound() {
    var scoreStrings = [];
    for(var i = 0; i < this.playerOrder.length; i++) {
      var playerName = this.playerOrder[i];
      scoreStrings.push("(score "+[playerName, this.scores[playerName][this.currentRound]].join(", ")+")");
    }
    return "scores for round "+this.currentRound+ ": ["+scoreStrings.join(", ")+"]";
  }

  endRound() {
    this.scoreRound(); 
    var results = this.displayScoresForCurrentRound();
    this.currentRound++;
    return results;
  }

  checkRoundEnd() {
    return this.playerOrder.every(n => this.players[n].getHand().length == 0);
  }

  checkGameEnd() {
    // three scores have been computed for each player
    return this.playerOrder.every(n => this.scores[n].length == 3);
  }

}

/*
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
  WasabiCard:WasabiCard,
  SquidNigiriCard:SquidNigiriCard,
  SalmonNigiriCard:SalmonNigiriCard,
  EggNigiriCard:NigiriCard,
  MakiCard:MakiCard,
  PuddingCard:PuddingCard
};
*/
