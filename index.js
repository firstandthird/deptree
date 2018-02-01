'use strict';
class DepTree {
  constructor() {
    this.nodes = {};
  }

  add(node, dependants) {
    if (!dependants) {
      dependants = [];
    } else if (!(dependants instanceof Array)) {
      dependants = [dependants];
    }
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
    const resolved = [];
    for (const node in this.nodes) {
      this.resolveNode(node, resolved);
    }
    for (let i = 0; i < resolved.length; i++) {
      if (Object.keys(this.nodes).indexOf(resolved[i]) === -1) {
        throw new Error(`Cannot find required dependency ${resolved[i]}`);
      }
    }
    return resolved;
  }
}

module.exports = DepTree;
