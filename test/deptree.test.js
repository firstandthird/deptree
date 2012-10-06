var assert = require('assert');
var DepTree = require('../');


suite('DepTree', function() {

  var depTree;
  setup(function() {
    depTree = new DepTree();
  });

  test('no dependents', function() {
    depTree.add('a');
    var results = depTree.resolve();

    assert.deepEqual(results, ['a']);
  });

  test('1 dependent', function() {
    depTree.add('a', 'b');
    var results = depTree.resolve();

    assert.deepEqual(results, ['b', 'a']);
  });

  test('2 dependents', function() {
    depTree.add('a', ['c', 'b']);
    var results = depTree.resolve();

    assert.deepEqual(results, ['c', 'b', 'a']);
  });

  test('add multiple', function() {
    depTree.add('a');
    depTree.add('b');
    var results = depTree.resolve();

    assert.deepEqual(results, ['a', 'b']);
  });

  test('no duplicates', function() {
    depTree.add('a', 'b');
    depTree.add('c', 'b');
    var results = depTree.resolve();

    assert.deepEqual(results, ['b', 'a', 'c']);
  });

  test('nested dependencies', function() {

    depTree.add('a', ['b', 'd']);
    depTree.add('b', ['c', 'd']);
    var results = depTree.resolve();

    assert.deepEqual(results, ['c', 'd', 'b', 'a']);
  });

  test('circular dependency check', function() {

    depTree.add('a', 'b');
    depTree.add('b', 'a');

    assert.throws(function() {
      depTree.resolve();
    });
  });

  test('advanced circular dependency check', function() {

    depTree.add('a', 'b');
    depTree.add('b', 'c');
    depTree.add('c', 'a');

    assert.throws(function() {
      depTree.resolve();
    });
  });

  test('circular dependency check', function() {

    depTree.add('a');
    depTree.add('b', 'a');
    depTree.add('c', ['a', 'b']);
    var results = depTree.resolve();
    assert.deepEqual(results, ['a', 'b', 'c']);

    
  });

});
