import * as util from './util';

export class Card {
  static typeName = "base";

  constructor(value=null) {
    this.id = util.uuidv4();
    this.type = Card.typeName; // override
    this.name = "base"; // override
    this.value = value;
  }

  display() {
    return "(card "+this.type+" "+this.name+" "+this.value+")";
  }

  // assuming the stack is valid
  score(stack) { // override
    console.warn("trying to score a stack with base Card class:",stack.map(c => c.type).join())
    return null;
  }

  // is there at least one card in this stack of the same type?
  existsInStack(stack) {
    var self = this;
    return stack.some(card => card.type === self.type);
  }

  isRelevantStack(stack) {
    let self = this;
    return stack.every(card => card.type === self.type);
  }

  isValidStack(stack) {
    return this.isRelevantStack(stack);
  }

  static rankCardsByValue(stack) {
    return stack.slice().sort((c1,c2) => c2.value-c1.value);
  }

  static findMaxValueCard(stack) {
    return stack.length === 0 ? null : this.rankCardsByValue(stack)[0];
  }

  // given a list of valid stacks, find the player (i.e., stack index) with the largest sum
  static getMaxPlayerStack(stacks) {
    if(stacks.length === 0) {
      return null;
    }
    let currSum = null;
    let idx = 0;
    for(let i = 0; i < stacks.length; i++) {
      let sum = this.sumStack(stacks[i]);
      if(currSum === null || sum > currSum) {
        idx = i;
        currSum = sum;
      }
    }
    return idx;
  }

  static rankPlayerStacks(stacks) {
    let objs = [];
    let self = this;
    stacks.forEach(stack => objs.push({"stack": stack,"sum": self.sumStack(stack),"idx": objs.length}));
    return objs.sort((objA,objB) => objB.sum - objA.sum); // sort descending
  }

  static sumStack(stack) {
    return stack.reduce((sum,card) => sum + card.value,0);
  }

  // returns the index of the first card of the requested type, or -1 if not found
  static indexOfType(stack,type) {
    return stack.map(c => c.type).indexOf(type);
  }
}

export class ChopsticksCard extends Card {
  static typeName = "chopsticks";

  constructor(value=null) {
    super(value);
    this.type = ChopsticksCard.typeName;
    this.name = ChopsticksCard.typeName;
  }

  // chopsticks can only ever be in a stack by themselves
  isRelevantStack(stack) {
    return stack.length === 0;
  }
}

export class PuddingCard extends Card {
  static typeName = "pudding";

  constructor(value=1) {
    super(value); // 1 by default
    this.type = PuddingCard.typeName;
    this.name = PuddingCard.typeName;
  }

  // assuming the stack is valid
  // only invoke at the end of the round to calculate the maximum pudding score
  score(stack) {
    return this.isValidStack(stack) ? stack.length : 0;
  }
}

export class MakiCard extends Card {
  static typeName = "maki";

  constructor(value=null) {
    super(value);
    this.type = MakiCard.typeName;
    this.name = MakiCard.typeName;
  }

  // assuming the stack is valid
  // only invoke at the end of the round to calculate the maximum maki score
  score(stack) {
    return this.isValidStack(stack) ? stack.reduce((acc,c) => c.value + acc, 0) : 0;
  }
}

export class DumplingCard extends Card {
  static typeName = "dumpling";

  constructor(value=null) {
    super(value);
    this.type = DumplingCard.typeName;
    this.name = DumplingCard.typeName;
  }

  // assuming the stack is valid
  score(stack) {
    if(this.isValidStack(stack)) {
      return {
        0: 0,
        1: 1,
        2: 3,
        3: 6,
        4: 10,
        5: 15
      }[stack.length];
    } else {
      return 0; // not a valid dumpling stack
    }
  }

  isValidStack(stack) {
    return this.isRelevantStack(stack) && stack.length <= 5; // at most 5 dumplings in the stack
  }
}

export class TempuraCard extends Card {
  static typeName = "tempura";

  constructor(value=null) {
    super(value);
    this.type = TempuraCard.typeName;
    this.name = TempuraCard.typeName;
  }

  // assuming the stack is valid
  score(stack) {
    return this.isValidStack(stack) && stack.length === 2 ? 5 : 0;
  }

  isValidStack(stack) {
    return this.isRelevantStack(stack) && stack.length <= 2; // at most 2 tempura in the stack
  }
}

export class SashimiCard extends Card {
  static typeName = "sashimi";

  constructor(value=null) {
    super(value);
    this.type = SashimiCard.typeName;
    this.name = SashimiCard.typeName;
  }

  // assuming the stack is valid
  score(stack) {
    return this.isValidStack(stack) && stack.length === 3 ? 10 : 0;
  }

  isValidStack(stack) {
    return this.isRelevantStack(stack) && stack.length <= 3; // at most 3 sashimi in the stack
  }
}

export class WasabiCard extends Card {
  static typeName = "wasabi";

  constructor(value=null) {
    super(value);
    this.type = WasabiCard.typeName;
    this.name = WasabiCard.typeName;
  }

  // assuming the stack is valid
  score(stack) {
    return NigiriCard.scoreHelper(stack);
  }

  isValidStack(stack) {
    return NigiriCard.isValidStackHelper(stack);
  }

  isRelevantStack(stack) {
    return NigiriCard.isRelevantStackHelper(stack);
  }
}

export class NigiriCard extends Card {
  static typeName = "nigiri";

  constructor(value=null) {
    super(value);
    this.type = NigiriCard.typeName;
    this.name = null; // override
  }

  score(stack) {
    return NigiriCard.scoreHelper(stack);
  }

  // assuming the stack only contains nigiri or wasabi
  static scoreHelper(stack) {
    let wasabi_count = 0;
    let nigiri_count = 0;
    stack.forEach(c => {
      wasabi_count += WasabiCard.typeName === c.type ? 1 : 0;
      nigiri_count += NigiriCard.typeName === c.type ? 1 : 0;
    });
    // is there only one nigiri, and at most one wasabi?
    if((wasabi_count + nigiri_count) === stack.length &&
      wasabi_count <= 1 && nigiri_count === 1) { 
      let nidx = Card.indexOfType(stack,NigiriCard.typeName);
      let widx = Card.indexOfType(stack,WasabiCard.typeName);
      return  nidx >= 0 ? (widx >= 0 ? 3*stack[nidx].value : stack[nidx].value) : 0;
    }
    return 0;
  }

  // no more than one wasabi and/or one nigiri
  static isValidStackHelper(stack) {
    let wasabi_count = 0;
    let nigiri_count = 0;
    for(let i = 0; i < stack.length; i++) {
      let card = stack[i];
      if(card.type === WasabiCard.typeName) {
        wasabi_count++;
      } else if (card.type === NigiriCard.typeName) {
        nigiri_count++;
      } else {
        return false;
      }
    }
    return wasabi_count <= 1 && nigiri_count <= 1;
  }

  // wasabi or nigiri only
  static isRelevantStackHelper(stack) {
    return stack.every(card => card.type === WasabiCard.typeName || card.type === NigiriCard.typeName);
  }

  isValidStack(stack) {
    return NigiriCard.isValidStackHelper(stack);
  }

  isRelevantStack(stack) {
    return NigiriCard.isRelevantStackHelper(stack);
  }
}

export class SquidNigiriCard extends NigiriCard {
  constructor() {
    super(3);
    this.name = "squid";
  }
}

export class SalmonNigiriCard extends NigiriCard {
  constructor() {
    super(2);
    this.name = "salmon";
  }
}

export class EggNigiriCard extends NigiriCard {
  constructor() {
    super(1);
    this.name = "egg";
  }
}
