var expect   = require('chai').expect;
var acorn    = require('acorn');
var path     = require('path');
var fixtures = require('./fixtures');
var bfs      = require('./index');

describe('acorn-bfs', function() {
  it('returns an array of nodes in BFS order of traversal', function() {
    var types = bfs(fixtures.simple).map(function(node) {
      return node.type;
    });

    expect(types).to.eql(['Program', 'FunctionDeclaration', 'BlockStatement',
      'ReturnStatement', 'Literal']);
  });

  it('does not exceed the max number of nodes, if set', function() {
    var res = bfs(fixtures.simple, 3);
    expect(res).to.have.length(3);
  });
});
