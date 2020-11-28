import * as game_objects from "../../game_objects";
import * as cards from "../../cards";

describe("Player", () => {
  test("#constructor can create player", () => {
    const playerName = "testPlayer";
    const discard = [new cards.Card(1)];
    const testPlayer = new game_objects.Player(discard,playerName);

    expect(testPlayer !== null && testPlayer !== undefined).toBeTruthy();
    expect(testPlayer.name).toEqual(playerName);
    expect(testPlayer.hand.length).toEqual(0);
    expect(testPlayer.discard.length).toEqual(1); // make sure we're using the discard
  });
  describe("#display", () => {
    test("#display for newly created player looks as expected", () => {
      const playerName = "testPlayer";
      const discard = [];
      const testPlayer = new game_objects.Player(discard,playerName);

      expect(testPlayer.display()).toEqual("(player testPlayer, (hand []), (tableau [], chopsticks active? false))");
    });
    test("#display for player with hand looks as expected", () => {
      const playerName = "testPlayer";
      const discard = [];
      const testPlayer = new game_objects.Player(discard,playerName);

      testPlayer.setHand([new cards.Card(1)]);
      expect(testPlayer.display()).toEqual("(player testPlayer, (hand [(card base base 1)]), (tableau [], chopsticks active? false))");
    });
  });
});

describe("Tableau", () => {
  test("#constructor() can create valid Tableau", () => {
    const discard = [];
    const tableau = new game_objects.Tableau(discard);
    expect(tableau !== null && tableau !== undefined).toBeTruthy();
  });
  describe("#addToStack()", () => {
    test("#addToStack() creates new stacks when stackId not specified", () => {
      const discard = [];
      const tableau = new game_objects.Tableau(discard);

      tableau.addToStack(new cards.TempuraCard()); // stack 1
      expect(tableau.stacks.length).toEqual(1);
      expect(tableau.stacks[0][0].type).toEqual(cards.TempuraCard.typeName);
      tableau.addToStack(new cards.DumplingCard(), null); // stack 2
      expect(tableau.stacks.length).toEqual(2);
      expect(tableau.stacks[1][0].type).toEqual(cards.DumplingCard.typeName);
    });
    test("#addToStack() adds to existing stack", () => {
      const discard = [];
      const tableau = new game_objects.Tableau(discard);

      tableau.addToStack(new cards.TempuraCard()); // stack 1
      tableau.addToStack(new cards.TempuraCard(), 0); // still stack 1

      expect(tableau.stacks.length).toEqual(1);
      expect(tableau.stacks[0].length).toEqual(2);
      expect(tableau.stacks[0][0].type).toEqual(cards.TempuraCard.typeName);
    });
    test("#addToStack() throws error when stackId > stacks.length or stackId < 0", () => {
      const discard = [];
      const tableau = new game_objects.Tableau(discard);
      let exception = 0;

      try {
        tableau.addToStack(new cards.TempuraCard(),1);
      } catch(e) {
        exception++;
      }

     try {
        tableau.addToStack(new cards.TempuraCard(),-1);
      } catch(e) {
        exception++;
      }

      expect(tableau.stacks.length).toEqual(0);
      expect(exception).toEqual(2);
    });
  });
  describe("#display", () => {
    test("#display for tableau with one stack looks as expected", () => {
      const discard = [];
      const tableau = new game_objects.Tableau(discard);

      tableau.addToStack(new cards.Card(1));
      expect(tableau.display()).toEqual("(tableau [(stack [(card base base 1)])], chopsticks active? false)");
    });
    test("#display for tableau with two stacks looks as expected", () => {
      const discard = [];
      const tableau = new game_objects.Tableau(discard);

      tableau.addToStack(new cards.TempuraCard()); // stack 1
      tableau.addToStack(new cards.DumplingCard()); // stack 2
      expect(tableau.display()).toEqual("(tableau [(stack [(card tempura tempura null)]), (stack [(card dumpling dumpling null)])], chopsticks active? false)");
    });
    test("#display for player with chopsticks looks as expected", () => {
      const discard = [];
      const tableau = new game_objects.Tableau(discard);

      tableau.activeChopsticks = new cards.ChopsticksCard();
      expect(tableau.display()).toEqual("(tableau [], chopsticks active? true)");
    });
  });
});
