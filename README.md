# DepTree

##Installation

```
npm install deptree
```

##Usage

```js
var DepTree = require('deptree');
var depTree = new DepTree();
depTree.add('a');
depTree.add('b', ['c', 'a']);
depTree.add('d', 'b');

var resolve = depTree.resolve();
//resolve == [ 'a', 'c', 'b', 'd' ]
```
