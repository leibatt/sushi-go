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
    stacks.forEach(stack => objs.push({"stack": stack,"sum": self.sumStack(stack),"idx": objs.length}));
    return objs.sort((objA,objB) => objB.sum - objA.sum); // sort descending
  }

  static sumStack(stack) {
    return stack.reduce((sum,card) => sum + card.value,0);
  }
}

ChopsticksCard = class extends Card {
  constructor(value=null) {
    super(value);
    this.type = "chopsticks";
    this.name = "chopsticks";
  }

  score(stack) {
    return 0;
  }
}

PuddingCard = class extends Card {
  constructor(value=1) {
    super(value); // 1 by default
    this.type = "pudding";
    this.name = "pudding";
  }

  // assuming the stack is valid
  // only invoke at the end of the round to calculate the maximum pudding score
  score(stack) {
    var self = this;
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

DumplingCard = class extends Card {
  constructor(value=null) {
    super(value);
    this.type = "dumpling";
    this.name = "dumpling";
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

SashimiCard = class extends Card {
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

WasabiCard = class extends Card {
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

NigiriCard = class extends Card {
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

SquidNigiriCard = class extends NigiriCard {
  constructor(value=null) {
    super(3); // hardcode the value
    this.name = "squid";
  }
}

SalmonNigiriCard = class extends NigiriCard {
  constructor(value=null) {
    super(2); // hardcode the value
    this.name = "salmon";
  }
}

EggNigiriCard = class extends NigiriCard {
  constructor(value=null) {
    super(1); // hardcode the value
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
