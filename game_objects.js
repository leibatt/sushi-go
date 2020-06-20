
sushiGoSim.Player = class {
  constructor(discard,name=null) {
    if(name) {
      this.name = name;
    } else {
      this.name = sushiGoSim.util.uuidv4();
    }
    this.discard = discard;
    this.hand = [];
    this.tableau = new sushiGoSim.Tableau(discard);
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




sushiGoSim.Tableau = class {
  constructor(discard) {
    this.stacks = [];
    this.discard = discard;
    // dummies, just for scoring
    this.scoringCards = [new sushiGoSim.cards.EggNigiriCard(),new sushiGoSim.cards.SalmonNigiriCard(),new sushiGoSim.cards.SquidNigiriCard(), new sushiGoSim.cards.WasabiCard(), new sushiGoSim.cards.SashimiCard(), new sushiGoSim.cards.TempuraCard(), new sushiGoSim.cards.DumplingCard()];
    // require special scoring: new sushiGoSim.cards.MakiCard(), new sushiGoSim.cards.PuddingCard()
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

  computePuddingScore() {
    return this.stacks.reduce((acc,stack) => acc + this.computeStackScoreForCardType(new sushiGoSim.cards.PuddingCard(),stack),0);
  }

  computeMakiScore() {
    return this.stacks.reduce((acc,stack) => acc + this.computeStackScoreForCardType(new sushiGoSim.cards.MakiCard(),stack),0);
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

sushiGoSim.Deck = class {
  constructor() {
    this.cards = [];
    //this.makeStandardDeck();
    this.makeTestDeck();
    this.shuffle();
  }

  shuffle() {
    sushiGoSim.util.shuffle(this.cards);
  }

  // removes and returns the *last* card in the array!
  drawCard() {
    return this.cards.pop();
  }

  makeTestDeck() {
/*
    // 14x Tempura
    for(var i = 0; i < 14; i++) {
      this.cards.push(new sushiGoSim.cards.TempuraCard());
    }

    // 14x Sashimi
    for(var i = 0; i < 14; i++) {
      this.cards.push(new sushiGoSim.cards.SashimiCard());
    }

    // 14x Dumpling
    for(var i = 0; i < 14; i++) {
      this.cards.push(new sushiGoSim.cards.DumplingCard());
    }

    // 10x Salmon Nigiri
    for(var i = 0; i < 10; i++) {
      this.cards.push(new sushiGoSim.cards.SalmonNigiriCard());
    }

    // 6x Wasabi
    for(var i = 0; i < 6; i++) {
      this.cards.push(new sushiGoSim.cards.WasabiCard());
    }

    // 5x Squid Nigiri
    for(var i = 0; i < 5; i++) {
      this.cards.push(new sushiGoSim.cards.SquidNigiriCard());
    }

    // 5x Egg Nigiri
    for(var i = 0; i < 5; i++) {
      this.cards.push(new sushiGoSim.cards.EggNigiriCard());
    }
    // 12x 2 Maki
    for(var i = 0; i < 12; i++) {
      this.cards.push(new sushiGoSim.cards.MakiCard(2));
    }

    // 8x 3 Maki
    for(var i = 0; i < 20; i++) {
      this.cards.push(new sushiGoSim.cards.MakiCard(3));
    }

    // 6x 1 Maki
    for(var i = 0; i < 40; i++) {
      this.cards.push(new sushiGoSim.cards.MakiCard(1));
    }
*/
    // 10x Pudding
    for(var i = 0; i < 60; i++) {
      this.cards.push(new sushiGoSim.cards.PuddingCard());
    }
  }

  makeStandardDeck() {
    // 14x Tempura
    for(var i = 0; i < 14; i++) {
      this.cards.push(new sushiGoSim.cards.TempuraCard());
    }

    // 14x Sashimi
    for(var i = 0; i < 14; i++) {
      this.cards.push(new sushiGoSim.cards.SashimiCard());
    }

    // 14x Dumpling
    for(var i = 0; i < 14; i++) {
      this.cards.push(new sushiGoSim.cards.DumplingCard());
    }

    // 12x 2 Maki
    for(var i = 0; i < 12; i++) {
      this.cards.push(new sushiGoSim.cards.MakiCard(2));
    }

    // 8x 3 Maki
    for(var i = 0; i < 8; i++) {
      this.cards.push(new sushiGoSim.cards.MakiCard(3));
    }

    // 6x 1 Maki
    for(var i = 0; i < 6; i++) {
      this.cards.push(new sushiGoSim.cards.MakiCard(1));
    }

    // 10x Salmon Nigiri
    for(var i = 0; i < 10; i++) {
      this.cards.push(new sushiGoSim.cards.SalmonNigiriCard());
    }

    // 5x Squid Nigiri
    for(var i = 0; i < 5; i++) {
      this.cards.push(new sushiGoSim.cards.SquidNigiriCard());
    }

    // 5x Egg Nigiri
    for(var i = 0; i < 5; i++) {
      this.cards.push(new sushiGoSim.cards.EggNigiriCard());
    }

    // 10x Pudding
    for(var i = 0; i < 10; i++) {
      this.cards.push(new sushiGoSim.cards.PuddingCard());
    }

    // 6x Wasabi
    for(var i = 0; i < 6; i++) {
      this.cards.push(new sushiGoSim.cards.WasabiCard());
    }

    // 4x Chopsticks
    for(var i = 0; i < 4; i++) {
      this.cards.push(new sushiGoSim.cards.ChopsticksCard());
    }
  }

  display() {
    return "(deck ["+this.cards.map((card) => card.display()).join(", ")+"])";
  }
}

sushiGoSim.GameManager = class {

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
    this.deck = new sushiGoSim.Deck();
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
    var player = new sushiGoSim.Player(this.discard,name);
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
        if(this.currentRound === 2) { // was this the last round?
          console.log("game over!");
          var res = this.endRound(true);
          console.log(this.displayFinalScores());
        } else {
          console.log("round over!");
          var res = this.endRound(false);
          console.log(res);
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

  // for calculating scores for Pudding at the end of the game
  computePuddingScores() {
    // prepare base scores
    var puddingScores = {};
    var items = this.playerOrder.map((n,i) => { 
      puddingScores[n] = 0;
      return {
        "id": i,
        "name": n,
        "score": this.players[n].getTableau().computePuddingScore()
      };
    });

    // Phase 1: players gain points
    if(items.length > 1) {
      items.sort((a,b) => b.score-a.score); // sort in reverse
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
          puddingScores[items[i].name] = pt;
        }
      } 
      // no second place
    }

    // Phase 2: players lose points
    if(items.length > 2) { // ignore in 2-player game
      items.sort((a,b) => a.score-b.score);
      // search for ties
      var mt = 0;
      for(var i = 1; i < items.length; i++) {
        if(items[i].score > items[0].score) {
          break;
        } else {
          mt = i;
        }
      }
      if(mt > 0) { // ties for first place
        var pt = Math.floor(6 / (mt + 1));
        for(var i = 0; i <= mt; i++) {
          puddingScores[items[i].name] -= pt;
        }
      } 
      // no second place
    }
    return puddingScores;
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

  scoreRound(finalround=false) {
    var scores = this.computeCurrentScores();
    var makiScores = this.computeMakiScores();
    if(finalround) {
      var puddingScores = this.computePuddingScores();
    } else {
      var puddingScores = {};
      this.playerOrder.forEach(p => { puddingScores[p] = 0; });
    }
    for(var i = 0; i < this.playerOrder.length; i++) {
      var playerName = this.playerOrder[i];
      console.log("player",playerName,"base score",scores[playerName],"maki score",makiScores[playerName],"pudding score",puddingScores[playerName]);
      this.scores[playerName].push(scores[playerName]+makiScores[playerName]+puddingScores[playerName]);
    }
    //return JSON.parse(JSON.stringify(this.scores));
  }

  displayFinalScores() {
   var scoreStrings = [];
    for(var i = 0; i < this.playerOrder.length; i++) {
      var playerName = this.playerOrder[i];
      scoreStrings.push("(score "+[playerName, sushiGoSim.util.sum(this.scores[playerName])].join(", ")+")");
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

  endRound(finalround=false) {
    this.scoreRound(finalround); 
    var results = this.displayScoresForCurrentRound();
    this.currentRound++;
    return results;
  }

  checkRoundEnd() {
    return this.playerOrder.every(n => this.players[n].getHand().length == 0);
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
