var DepTree = function() {
  this.nodes = {}; 
};

DepTree.prototype.add = function(node, dependants) {
  var self = this;

  if (!dependants) {
    dependants = [];
  } else if (!(dependants instanceof Array)) {
    dependants = [dependants];
  }

  this.nodes[node] = dependants;
};


DepTree.prototype.resolveNode = function(node, resolved, processing) {

  var self = this;

  resolved = resolved || [];
  processing = processing || {};
  var deps = this.nodes[node] || [];

  processing[node] = true;

  deps.forEach(function(dep) {
    if (resolved.indexOf(dep) != -1) {
      return;
    }
    if (processing[dep]) {
      throw new Error('Circular dependency: '+dep);
    }
    self.resolveNode(dep, resolved, processing);
  });

  if (resolved.indexOf(node) == -1) {
    processing[node] = false;
    resolved.push(node);
  }
  return resolved;
};

DepTree.prototype.resolve = function() {

  var resolved = [];
  for (var node in this.nodes) {
    this.resolveNode(node, resolved);
  }

  return resolved;

};


module.exports = DepTree;
