var assert = require('assert');
var game_objects = require('game_objects.js')

describe('Card', function() {
  describe('#findMaxValueCard()', function() {
    it('check empty', function() {
      assert.equal([], null);
    });
    it('check set of 1', function() {
      var card = new game_objects.Card(1);
      var maxCard = Card.findMaxValueCard([card]);
      assert.equal(maxCard.id, card.id);
    });
    it('check set of 2', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var maxCard = Card.findMaxValueCard([card,card2]);
      assert.equal(maxCard.id, card2.id);
    });
  });
  describe('#getMaxPlayerStack()', function() {
    it('check no stacks', function() {
      assert.equal(getMaxPlayerStack([]), null);
    });
    it('check empty stack', function() {
      assert.equal(getMaxPlayerStack([[]]), 0);
    });
    it('check one stack', function() {
      var card = new game_objects.Card(1);
      assert.equal(getMaxPlayerStack([[card]]), 0);
    });
    it('check two stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      assert.equal(getMaxPlayerStack([[],[]]), null);
      assert.equal(getMaxPlayerStack([[card],[card2]]), 1);
      assert.equal(getMaxPlayerStack([[],[card,card2]]), 1);
      assert.equal(getMaxPlayerStack([[card2,card2],[card3]]), 0);
    });
    it('check three stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      assert.equal(getMaxPlayerStack([[],[],[]]), null);
      assert.equal(getMaxPlayerStack([[card3],[card2],[card]]), 0);
      assert.equal(getMaxPlayerStack([[card],[card3],[card2]]), 1);
      assert.equal(getMaxPlayerStack([[card],[card2],[card3]]), 2);
      assert.equal(getMaxPlayerStack([[],[card],[card2,card3]]), 2);
    });
    it('check five stacks', function() {
      var card = new game_objects.Card(1);
      var card2 = new game_objects.Card(2);
      var card3 = new game_objects.Card(3);
      var card4 = new game_objects.Card(4);
      var card5 = new game_objects.Card(5);
      assert.equal(getMaxPlayerStack([[],[card],[card,card2,card3],[card4,card5],[]]), 3);
    });
  });
});
