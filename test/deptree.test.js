'use strict';
const DepTree = require('../');
const test = require('tape');
/* eslint-disable no-undef */

test('no dependents', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a');
  const results = depTree.resolve();
  t.deepEqual(results, ['a']);
});

test('1 dependent', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a', 'b');
  const results = depTree.resolve();
  t.deepEqual(results, ['b', 'a']);
});

test('2 dependents', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a', ['c', 'b']);
  const results = depTree.resolve();
  t.deepEqual(results, ['c', 'b', 'a']);
});

test('add multiple', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a');
  depTree.add('b');
  const results = depTree.resolve();
  t.deepEqual(results, ['a', 'b']);
});

test('no duplicates', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a', 'b');
  depTree.add('c', 'b');
  depTree.add('b', []);
  const results = depTree.resolve();
  t.deepEqual(results, ['b', 'a', 'c']);
});

test('no broken dependencies', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a', 'b');
  depTree.add('c', 'b');
  try {
    depTree.resolve();
  } catch (e) {
    t.equal(e.toString(), 'Error: Missing plugin dependency b', 'throws error if missing plugin dependency');
    return;
  }
  t.fail();
});

test('nested dependencies', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a', ['b', 'd']);
  depTree.add('b', ['c', 'd']);
  depTree.add('c', []);
  depTree.add('d', []);
  const results = depTree.resolve();
  t.deepEqual(results, ['c', 'd', 'b', 'a']);
});

test('circular dependency check', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a', 'b');
  depTree.add('b', 'a');
  t.throws(() => {
    depTree.resolve();
  });
});

test('advanced circular dependency check', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a', 'b');
  depTree.add('b', 'c');
  depTree.add('c', 'a');
  t.throws(() => {
    depTree.resolve();
  });
});

test('circular dependency check', (t) => {
  t.plan(1);
  const depTree = new DepTree();
  depTree.add('a');
  depTree.add('b', 'a');
  depTree.add('c', ['a', 'b']);
  const results = depTree.resolve();
  t.deepEqual(results, ['a', 'b', 'c']);
});
