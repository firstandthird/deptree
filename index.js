'use strict';
class DepTree {
  constructor() {
    this.nodes = {};
  }

  add(node, dependants) {
    if (!dependants) {
      dependants = [];
    } else if (!Array.isArray(dependants)) {
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
      if (resolved.includes(dep)) {
        return;
      }
      if (processing[dep]) {
        throw new Error(`Circular dependency: ${dep}`);
      }
      this.resolveNode(dep, resolved, processing);
    });
    if (!resolved.includes(node)) {
      processing[node] = false;
      resolved.push(node);
    }
    return resolved;
  }

  resolve() {
    const resolved = [];
    Object.keys(this.nodes).forEach(node => this.resolveNode(node, resolved));
    for (let i = 0; i < resolved.length; i++) {
      if (!Object.keys(this.nodes).includes(resolved[i])) {
        throw new Error(`Cannot find required dependency ${resolved[i]}`);
      }
    }
    return resolved;
  }
}

module.exports = DepTree;
