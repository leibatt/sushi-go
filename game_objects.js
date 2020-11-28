import * as cards from './cards'; // SushiGo card classes
import * as util from './util';

export class Player {
  constructor(discard,name=null) {
    if(name !== null) {
      this.name = name;
    } else {
      this.name = util.uuidv4();
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
    let card = this.hand.splice(cardId, 1 )[0];
    this.tableau.addToStack(card,stackId);
  }

  addPudding(cardId) {
    let card = this.hand.splice(cardId, 1)[0];
    this.tableau.puddingCache.push(card);
  }

  takeChopsticks(cardId) {
    let card = this.hand.splice(cardId, 1)[0];
    this.tableau.activeChopsticks = card;
  }

  // cardIds = the 2 ids for the cards to take from the current hand, as an array
  // stackIds = the stacks to add these cards to in the tableau
  replaceChopsticks(cardIds,stackIds) {
    if(cardIds.length !== 2 || stackIds.length !== 2) {
      throw "Did not return appropriate number of cards and/or stacks!";
    }
    let pairs = cardIds.map((cardId,i) => {
      return {"cardId": cardId,"stackId": stackIds[i]};
    });
    // sort largest card ids first, since removing them will not disrupt the other ids
    pairs.sort((a,b) => b.cardId-a.cardId);
    
    if(this.tableau.activeChopsticks) {
      // take the (2) cards from the current hand
      pairs.forEach(p => {
        //let card = this.hand.splice(p.cardId, 1)[0];
        this.moveCardToTableau(p.cardId,p.stackId);
      });
      // put the reserved chopsticks in the current hand
      this.hand.push(this.tableau.activeChopsticks);
      this.tableau.activeChopsticks = null;
    } else {
      console.log("no active chopsticks!!!");
    }
  }

  clearTableau() {
    this.tableau.clear();
  }
}


export class Tableau {
  constructor(discard) {
    this.stacks = [];
    this.puddingCache = []; // for keeping puddings around
    this.activeChopsticks = null; // for tracking use of chopsticks
    this.discard = discard;
    // dummies, just for scoring
    this.scoringCards = [new cards.EggNigiriCard(),new cards.SalmonNigiriCard(),new cards.SquidNigiriCard(), new cards.WasabiCard(), new cards.SashimiCard(), new cards.TempuraCard(), new cards.DumplingCard()];
    // require special scoring: new cards.MakiCard(), new cards.PuddingCard()
  }

  addToStack(card,stackId=null) {
    //console.log(card.display(),stackId);
    if(stackId === null || stackId === undefined) { // make a new stack
      this.stacks.push([card]);
      //console.log("got here1");
    } else if(stackId >= 0 && stackId < this.stacks.length) { // valid stackId was passed
      this.stacks[stackId].push(card);
      //console.log("got here2");
    } else { // something bad happened
      //console.log("got here3");
      throw ["did not add card to stack! ",card.display(),stackId].join(" ");
    }
  }

  computeScore() {
    let score = 0;
    for(let i = 0; i < this.stacks.length; i++) {
      let stack = this.stacks[i];
      score += this.computeStackScore(stack);
    }
    return score;
  }

  computeStackScoreForCardType(scoringCard,stack) {
    return scoringCard.score(stack);
  }

  computePuddingScore() {
    return this.computeStackScoreForCardType(new cards.PuddingCard(),this.puddingCache);
  }

  computeMakiScore() {
    return this.stacks.reduce((acc,stack) => acc + this.computeStackScoreForCardType(new cards.MakiCard(),stack),0);
  }

  // compute the first valid score found for this stack
  computeStackScore(stack) {
    //console.log("executing computeStackScore");
    for(let i = 0; i < this.scoringCards.length; i++) {
      //console.log(this.scoringCards[i],this.scoringCards[i].score(stack));
      //let score = this.scoringCards[i].score(stack);
      let score = this.computeStackScoreForCardType(this.scoringCards[i],stack);
      if(score > 0) {
        return score;
      } else if (score < 0) {
        throw "negative score: " + score;
      } // otherwise score is zero, ignore
    }
    return 0; // by default the score is zero
  }

  // add the card to the given stack ID
  addCard(card,i) {
    this.stacks[i].push(card);
  }

  // find all stacks that this card could belong to
  findValidStacks(card) {
    if(this.stacks.length == 0) {
      return null;
    }

    let found = [];
    for(let i = 0; i < this.stacks.length; i++) {
      let stack = this.stacks[i];
      for(let j = 0; j < stack.length; j++) {
        let c = stack[j];
        if(card.type === c.type) {
          found.push(i);
          break;
        }
      }
    }
    return found;
  }

  display() {
    let stackDisplays = [];
    for(let i = 0; i < this.stacks.length; i++) {
      let stack = this.stacks[i];
      stackDisplays.push("(stack ["+stack.map((card) => card.display()).join(", ")+"])");
    }
    return "(tableau ["+ stackDisplays.join(", ") + "], chopsticks active? "+ (this.activeChopsticks !== null) +")";
  }

  clear() {
    // move tableau to discard pile
    for(let i = 0; i < this.stacks.length; i++) {
      let stack = this.stacks[i];
      for(let j = 0; j < stack.length; j++) {
        let card = stack[j];
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

export class Deck {
  constructor(debug=false) {
    this.cards = [];
    if(debug) {
      this.makeTestDeck();
    } else {
      this.makeStandardDeck();
    }
    this.shuffle();
  }

  shuffle() {
    util.shuffle(this.cards);
  }

  // removes and returns the *last* card in the array!
  drawCard() {
    return this.cards.pop();
  }

  makeTestDeck() {
/*
    // 14x Tempura
    for(let i = 0; i < 14; i++) {
      this.cards.push(new cards.TempuraCard());
    }

    // 14x Sashimi
    for(let i = 0; i < 14; i++) {
      this.cards.push(new cards.SashimiCard());
    }

    // 14x Dumpling
    for(let i = 0; i < 14; i++) {
      this.cards.push(new cards.DumplingCard());
    }

    // 6x Wasabi
    for(let i = 0; i < 6; i++) {
      this.cards.push(new cards.WasabiCard());
    }
*/

    // 10x Salmon Nigiri
    for(let i = 0; i < 4; i++) {
      this.cards.push(new cards.SalmonNigiriCard());
    }

    // 5x Squid Nigiri
    for(let i = 0; i < 4; i++) {
      this.cards.push(new cards.SquidNigiriCard());
    }

    // 5x Egg Nigiri
    for(let i = 0; i < 4; i++) {
      this.cards.push(new cards.EggNigiriCard());
    }

/*
    // 12x 2 Maki
    for(let i = 0; i < 12; i++) {
      this.cards.push(new cards.MakiCard(2));
    }

    // 8x 3 Maki
    for(let i = 0; i < 20; i++) {
      this.cards.push(new cards.MakiCard(3));
    }

    // 6x 1 Maki
    for(let i = 0; i < 40; i++) {
      this.cards.push(new cards.MakiCard(1));
    }
    // 10x Pudding
    for(let i = 0; i < 20; i++) {
      this.cards.push(new cards.PuddingCard());
    }
*/
    // 4x Chopsticks
    for(let i = 0; i < 4; i++) {
      this.cards.push(new cards.ChopsticksCard());
    }
  }

  makeStandardDeck() {
    // 14x Tempura
    for(let i = 0; i < 14; i++) {
      this.cards.push(new cards.TempuraCard());
    }

    // 14x Sashimi
    for(let i = 0; i < 14; i++) {
      this.cards.push(new cards.SashimiCard());
    }

    // 14x Dumpling
    for(let i = 0; i < 14; i++) {
      this.cards.push(new cards.DumplingCard());
    }

    // 12x 2 Maki
    for(let i = 0; i < 12; i++) {
      this.cards.push(new cards.MakiCard(2));
    }

    // 8x 3 Maki
    for(let i = 0; i < 8; i++) {
      this.cards.push(new cards.MakiCard(3));
    }

    // 6x 1 Maki
    for(let i = 0; i < 6; i++) {
      this.cards.push(new cards.MakiCard(1));
    }

    // 10x Salmon Nigiri
    for(let i = 0; i < 10; i++) {
      this.cards.push(new cards.SalmonNigiriCard());
    }

    // 5x Squid Nigiri
    for(let i = 0; i < 5; i++) {
      this.cards.push(new cards.SquidNigiriCard());
    }

    // 5x Egg Nigiri
    for(let i = 0; i < 5; i++) {
      this.cards.push(new cards.EggNigiriCard());
    }

    // 10x Pudding
    for(let i = 0; i < 10; i++) {
      this.cards.push(new cards.PuddingCard());
    }

    // 6x Wasabi
    for(let i = 0; i < 6; i++) {
      this.cards.push(new cards.WasabiCard());
    }

    // 4x Chopsticks
    for(let i = 0; i < 4; i++) {
      this.cards.push(new cards.ChopsticksCard());
    }
  }

  display() {
    return "(deck ["+this.cards.map((card) => card.display()).join(", ")+"])";
  }
}

export class GameManager {

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
    if(players !== null) {
      players.forEach((name) => {
        this.createPlayer(name);
        this.playerOrder.push(name);
        this.scores[name] = [];
      });
    }
    this.deck = new Deck(debug);
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
    let player = new Player(this.discard,name);
    this.players[player.getName()] = player;
    return player;
  }

  rotateHands() {
    if(this.playerOrder.length === 0) { // no players!
      return;
    }
    let prevHand = this.players[this.playerOrder[0]].getHand();
    for(let i = 1; i < this.playerOrder.length; i++) {
      let currHand = this.players[this.playerOrder[i]].getHand();
      //console.log([this.playerOrder[i],"prevHand","(hand ["+ prevHand.map((card) => card.display()).join(", ")+"])"]);
      //console.log([this.playerOrder[i],"currHand","(hand ["+ currHand.map((card) => card.display()).join(", ")+"])"]);
      this.players[this.playerOrder[i]].setHand(prevHand);
      //console.log([this.playerOrder[i],"new hand","(hand ["+ this.players[this.playerOrder[i]].getHand().map((card) => card.display()).join(", ")+"])"]);
      prevHand = currHand;
    }
    this.players[this.playerOrder[0]].setHand(prevHand);
  }

  assignHands() {
    let names = Object.keys(this.players);
    if(names.length < 2) {
      throw "Insufficient number of players: "+names.length;
    }
    let cardsPerPlayer = {
      2: 10,
      3: 9,
      4: 8,
      5: 7
    }[names.length];
    if(this.debug) {
      cardsPerPlayer = 4;
    }
    for(let i = 0; i < cardsPerPlayer; i++) {
      for(let j = 0; j < names.length; j++) {
        this.players[names[j]].getHand().push(this.deck.drawCard());
      }
    }
  }

  replaceChopsticks(playerName,cardIds,stackIds) {
    if(this.currentTurn === this.playerOrder.indexOf(playerName)) {
      this.players[playerName].replaceChopsticks(cardIds,stackIds);
      this.endTurn();
    } else {
      throw "not the current player's turn: " + ["playerName: ",playerName,"current turn: ",this.currentTurn,"index of playerName: ",this.playerOrder.indexOf(playerName)].join(" ");
    }
  }

  moveCardToTableau(playerName,cardId,stackId=null) {
    if(this.currentTurn === this.playerOrder.indexOf(playerName)) {
      // TODO: make this more general
      if(this.players[playerName].hand[cardId].type === "pudding") {
        this.players[playerName].addPudding(cardId);
      } else if(this.players[playerName].hand[cardId].type === "chopsticks") {
        if(this.players[playerName].tableau.activeChopsticks) { // already active!
          if(this.players[playerName].hand.length > 1) { // not the last turn
            throw "already have active chopsticks with playerName: " + playerName;
          } else { // player is just out of luck
            this.players[playerName].takeChopsticks(cardId);
          }
        } else {
          this.players[playerName].takeChopsticks(cardId);
        }
      } else {
        this.players[playerName].moveCardToTableau(cardId,stackId);
      }
      this.endTurn();
    } else {
      throw "not the current player's turn: " + ["playerName: ",playerName,"current turn: ",this.currentTurn,"index of playerName: ",this.playerOrder.indexOf(playerName)].join(" ");
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
          this.endRound(true);
          console.log(this.displayFinalScores());
        } else {
          console.log("round over!");
          let res = this.endRound(false);
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
    let scores = {};
    for(let i = 0; i < this.playerOrder.length; i++) {
      let playerName = this.playerOrder[i];
      scores[playerName] = this.players[this.playerOrder[i]].getTableau().computeScore();
    }
    return scores;
  }

  // for calculating scores for Pudding at the end of the game
  computePuddingScores() {
    // prepare base scores
    let puddingScores = {};
    let items = this.playerOrder.map((n,i) => { 
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
      let mt = 0;
      for(let i = 1; i < items.length; i++) {
        if(items[i].score < items[0].score) {
          break;
        } else {
          mt = i;
        }
      }
      if(mt > 0) { // ties for first place
        let pt = Math.floor(6 / (mt + 1));
        for(let i = 0; i <= mt; i++) {
          puddingScores[items[i].name] = pt;
        }
      } else {
        puddingScores[items[0].name] = 6;
        // no second place
      } 
    }

    // Phase 2: players lose points
    if(items.length > 2) { // ignore in 2-player game
      items.sort((a,b) => a.score-b.score);
      // search for ties
      let mt = 0;
      for(let i = 1; i < items.length; i++) {
        if(items[i].score > items[0].score) {
          break;
        } else {
          mt = i;
        }
      }
      if(mt > 0) { // ties for first place
        let pt = Math.floor(6 / (mt + 1));
        for(let i = 0; i <= mt; i++) {
          puddingScores[items[i].name] -= pt;
        }
      } else {
        puddingScores[items[0].name] -= 6;
        // no second place
      } 
    }
    return puddingScores;
  }

  // for calculating scores for Maki
  computeMakiScores() {
    let items = [];
    this.playerOrder.forEach((n,i) => {
      items.push({
        "id": i,
        "name": n,
        "score": this.players[n].getTableau().computeMakiScore()
      });
    });
    items.sort((a,b) => b.score-a.score); // sort in reverse

    // prepare base scores
    let makiScores = {};
    items.forEach(i => { makiScores[i.name] = 0; });

    if(items.length > 1) {
      // search for ties
      let mt = 0;
      for(let i = 1; i < items.length; i++) {
        if(items[i].score < items[0].score) {
          break;
        } else {
          mt = i;
        }
      }
      if(mt > 0) { // ties for first place
        let pt = Math.floor(6 / (mt + 1));
        for(let i = 0; i <= mt; i++) {
          makiScores[items[i].name] = pt;
        }
      } else { // check ties for second place
        makiScores[items[0].name] = 6;
        mt = 1;
        for(let i = 2; i < items.length; i++) {
          if(items[i].score < items[1].score) {
            break;
          } else {
            mt = i;
          }
        }
        let pt = Math.floor(3 / mt); // will always be 1
        for(let i = 1; i <= mt; i++) {
          makiScores[items[i].name] = pt;
        }
      }
    }
    return makiScores;
  }

  scoreRound(finalround=false) {
    let scores = this.computeCurrentScores();
    let makiScores = this.computeMakiScores();
    let puddingScores;
    if(finalround) {
      puddingScores = this.computePuddingScores();
    } else {
      puddingScores = {};
      this.playerOrder.forEach(p => { puddingScores[p] = 0; });
    }
    for(let i = 0; i < this.playerOrder.length; i++) {
      let playerName = this.playerOrder[i];
      console.log("player",playerName,"base score",scores[playerName],"maki score",makiScores[playerName],"pudding score",puddingScores[playerName]);
      this.scores[playerName].push(scores[playerName]+makiScores[playerName]+puddingScores[playerName]);
    }
    //return JSON.parse(JSON.stringify(this.scores));
  }

  displayFinalScores() {
   let scoreStrings = [];
    for(let i = 0; i < this.playerOrder.length; i++) {
      let playerName = this.playerOrder[i];
      scoreStrings.push("(score "+[playerName, util.sum(this.scores[playerName])].join(", ")+")");
    }
    return "final scores : ["+scoreStrings.join(", ")+"]";
  }

  displayScoresForCurrentRound() {
    let scoreStrings = [];
    for(let i = 0; i < this.playerOrder.length; i++) {
      let playerName = this.playerOrder[i];
      scoreStrings.push("(score "+[playerName, this.scores[playerName][this.currentRound]].join(", ")+")");
    }
    return "scores for round "+this.currentRound+ ": ["+scoreStrings.join(", ")+"]";
  }

  endRound(finalround=false) {
    this.scoreRound(finalround); 
    let results = this.displayScoresForCurrentRound();
    this.currentRound++;
    return results;
  }

  checkRoundEnd() {
    return this.playerOrder.every(n => this.players[n].getHand().length == 0);
  }
}
