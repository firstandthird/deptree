'use strict';
const assert = require('assert');
const DepTree = require('../');
/* eslint-disable no-undef */

suite('DepTree', () => {
  let depTree;
  setup(() => {
    depTree = new DepTree();
  });

  test('no dependents', () => {
    depTree.add('a');
    const results = depTree.resolve();
    assert.deepEqual(results, ['a']);
  });

  test('1 dependent', () => {
    depTree.add('a', 'b');
    const results = depTree.resolve();
    assert.deepEqual(results, ['b', 'a']);
  });

  test('2 dependents', () => {
    depTree.add('a', ['c', 'b']);
    const results = depTree.resolve();
    assert.deepEqual(results, ['c', 'b', 'a']);
  });

  test('add multiple', () => {
    depTree.add('a');
    depTree.add('b');
    const results = depTree.resolve();
    assert.deepEqual(results, ['a', 'b']);
  });

  test('no duplicates', () => {
    depTree.add('a', 'b');
    depTree.add('c', 'b');
    const results = depTree.resolve();
    assert.deepEqual(results, ['b', 'a', 'c']);
  });

  test('nested dependencies', () => {
    depTree.add('a', ['b', 'd']);
    depTree.add('b', ['c', 'd']);
    const results = depTree.resolve();
    assert.deepEqual(results, ['c', 'd', 'b', 'a']);
  });

  test('circular dependency check', () => {
    depTree.add('a', 'b');
    depTree.add('b', 'a');
    assert.throws(() => {
      depTree.resolve();
    });
  });

  test('advanced circular dependency check', () => {
    depTree.add('a', 'b');
    depTree.add('b', 'c');
    depTree.add('c', 'a');
    assert.throws(() => {
      depTree.resolve();
    });
  });

  test('circular dependency check', () => {
    depTree.add('a');
    depTree.add('b', 'a');
    depTree.add('c', ['a', 'b']);
    const results = depTree.resolve();
    assert.deepEqual(results, ['a', 'b', 'c']);
  });
});
