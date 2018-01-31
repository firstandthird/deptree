'use strict';
class DepTree {
  constructor() {
    this.nodes = {};
    this.names = [];
    this.dependencies = [];
  }

  add(node, dependants) {
    if (!dependants) {
      dependants = [];
    } else if (!(dependants instanceof Array)) {
      dependants = [dependants];
    }
    this.names.push(node);
    this.dependencies = this.dependencies.concat(dependants);
    this.nodes[node] = dependants;
  }

  resolveNode(node, resolved, processing) {
    resolved = resolved || [];
    processing = processing || {};
    const deps = this.nodes[node] || [];

    processing[node] = true;

    deps.forEach((dep) => {
      if (resolved.indexOf(dep) !== -1) {
        return;
      }
      if (processing[dep]) {
        throw new Error(`Circular dependency: ${dep}`);
      }
      this.resolveNode(dep, resolved, processing);
    });
    if (resolved.indexOf(node) === -1) {
      processing[node] = false;
      resolved.push(node);
    }
    return resolved;
  }

  resolve() {
    // ensure all dependencies exist:
    if (this.names.length > 1) {
      for (let i = 0; i < this.dependencies.length; i++) {
        if (!this.names.includes(this.dependencies[i])) {
          throw new Error(`Missing plugin dependency ${this.dependencies[i]}`);
        }
      }
    }
    const resolved = [];
    for (const node in this.nodes) {
      this.resolveNode(node, resolved);
    }

    return resolved;
  }
}

module.exports = DepTree;
