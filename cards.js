const util = require('./util');

Card = class {
  constructor(value=null) {
    this.id = util.uuidv4();
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

ChopsticksCard = class extends Card {
  static typeName = "chopsticks";

  constructor(value=null) {
    super(value);
    this.type = ChopsticksCard.typeName;
    this.name = ChopsticksCard.typeName;
  }

  score(stack) {
    return 0;
  }
}

PuddingCard = class extends Card {
  static typeName = "pudding";

  constructor(value=1) {
    super(value); // 1 by default
    this.type = PuddingCard.typeName;
    this.name = PuddingCard.typeName;
  }

  // assuming the stack is valid
  // only invoke at the end of the round to calculate the maximum pudding score
  score(stack) {
    let self = this;
    //console.log("calling scoring method for PuddingCard class");
    //console.log([stack,"is valid stack?",this.isValidStack(stack),"score?",stack.reduce((acc,c) => c.type === self.type ? c.value + acc : acc,0)]);
    if(this.isValidStack(stack)) {
      return stack.reduce((acc,c) => c.type === self.type ? c.value + acc : acc,0);
    } else {
      return 0; // score should be done compared to everyone else
    }
  }
}

MakiCard = class extends Card {
  static typeName = "maki";

  constructor(value=null) {
    super(value);
    this.type = MakiCard.typeName;
    this.name = MakiCard.typeName;
  }

  // assuming the stack is valid
  // only invoke at the end of the round to calculate the maximum maki score
  score(stack) {
    //console.log("calling scoring method for MakiCard class");
    //console.log([stack,"is valid stack?",this.isValidStack(stack),"score?",stack.reduce((acc,c) => c.type === self.type ? c.value + acc : acc,0)]);
    if(this.isValidStack(stack)) {
      return stack.reduce((acc,c) => c.type === MakiCard.typeName ? c.value + acc : acc,0);
    } else {
      return 0; // score should be done compared to everyone else
    }
  }
}

DumplingCard = class extends Card {
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

TempuraCard = class extends Card {
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

SashimiCard = class extends Card {
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

WasabiCard = class extends Card {
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

NigiriCard = class extends Card {
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

SquidNigiriCard = class extends NigiriCard {
  constructor(value=null) {
    super(3);
    this.name = "squid";
  }
}

SalmonNigiriCard = class extends NigiriCard {
  constructor(value=null) {
    super(2);
    this.name = "salmon";
  }
}

EggNigiriCard = class extends NigiriCard {
  constructor(value=null) {
    super(1);
    this.name = "egg";
  }
}

module.exports = {
  Card: Card,
  ChopsticksCard: ChopsticksCard,
  DumplingCard: DumplingCard,
  SashimiCard: SashimiCard,
  TempuraCard: TempuraCard,
  NigiriCard: NigiriCard,
  WasabiCard: WasabiCard,
  SquidNigiriCard: SquidNigiriCard,
  SalmonNigiriCard: SalmonNigiriCard,
  EggNigiriCard: EggNigiriCard,
  MakiCard: MakiCard,
  PuddingCard: PuddingCard
};
