/**
 * Returns an array of nodes in the passed AST, traversed using BFS. Accepts an
 * optional maximum number, n, of nodes to return. The returned array always
 * begins with the root node.
 *
 * @param {Node} node The root node of the AST to traverse
 * @param {int}  [n]  Optional max number of nodes to return
 */
module.exports = function(node, n) {
  var queue, res, i, children;

  queue = [node];
  res = [node];

  while (queue.length > 0) {
    node = queue.shift();

    if (n && res.length >= n) {
      return res.slice(0, n);
    }

    children = getChildren(node) || [];
    for (i = 0; i < children.length; i++) {
      queue.push(children[i]);
      res.push(children[i]);
    }
  }

  return res.slice(0, n);
};

/**
 * Returns a given node's children as an array of nodes. Designed for use
 * with acorn's ASTs.
 *
 * @param   {Node}   The node for which to retrieve its children
 * @returns {Node[]} An array of child nodes
 */
function getChildren(node) {
  var res, temp, i, j;

  switch (node.type) {
    case 'Expression':
    case 'ThisExpression':
    case 'Super':
    case 'MetaProperty':
    case 'Statement':
    case 'BreakStatement':
    case 'ContinueStatement':
    case 'EmptyStatement':
    case 'DebuggerStatement':
    case 'ForInit':
    case 'ScopeBody':
    case 'Identifier':
    case 'Literal':
    case 'ImportDefaultSpecifier':
    case 'ImportNamespaceSpecifier':
    case 'VariablePattern':
    case 'MemberPattern':
      return [];

    case 'Program':
    case 'BlockStatement':
      res = [];
      for (i = 0; i < node.body.length; i++) {
        if (node.body[i]) res.push(node.body[i]);
      }
      return res;

    case 'ExpressionStatement':
    case 'ParenthesizedExpression':
      return (node.expression) ? [node.expression] : [];

    case 'IfStatement':
      res = [node.test, node.consequent];
      if (node.alternate) res.push(node.alternate);
      return res;

    case 'Function':
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
    case 'FunctionDeclaration':
      res = [];
      if (node.params) {
        for (i = 0; i < node.params.length; i++) {
          res.push(node.params[i]);
        }
      }
      if (node.id) res.push(node.id);
      if (node.body) res.push(node.body);
      return res;

    case 'LabeledStatement':
      return (node.body) ? [node.body] : [];

    case 'WithStatement':
      return [node.object, node.body];

    case 'SwitchStatement':
      res = [node.discriminant];
      for (i = 0; i < node.cases.length; i++) {
        temp = node.cases[i];
        if (temp.test) res.push(temp.test);
        for (j = 0; j < temp.consequent.length; j++) {
          res.push(temp.consequent[j]);
        }
      }
      return res;

    case 'ReturnStatement':
    case 'YieldExpression':
    case 'ThrowStatement':
    case 'SpreadElement':
      return (node.argument) ? [node.argument] : [];

    case 'TryStatement':
      res = [node.block];
      if (node.handler) {
        if (node.handler.param) res.push(node.handler.param);
        if (node.handler.body) res.push(node.handler.body);
      }
      if (node.finalizer) res.push(node.finalizer);
      return res;

    case 'DoWhileStatement':
    case 'WhileStatement':
      return [node.test, node.body];

    case 'ForStatement':
      res = [];
      if (node.init) res.push(node.init);
      if (node.test) res.push(node.test);
      if (node.update) res.push(node.update);
      res.push(node.body);
      return res;

    case 'ForInStatement':
    case 'ForOfStatement':
      return [node.left, node.right, node.body];

    case 'VariableDeclaration':
      res = [];
      for (i = 0; i < node.declarations.length; i++) {
        temp = node.declarations[i];
        if (temp.id) res.push(temp.id);
        if (temp.init) res.push(temp.init);
      }
      return res;

    case 'ArrayExpression':
    case 'ArrayPattern':
      res = [];
      for (i = 0; i < node.elements.length; i++) {
        temp = node.elements[i];
        if (temp) res.push(temp);
      }
      return res;

    case 'ObjectExpression':
    case 'ObjectPattern':
      res = [];
      for (i = 0; i < node.properties.length; ++i) {
        res.push(node.properties[i]);
      }
      return res;

    case 'SequenceExpression':
    case 'TemplateLiteral':
      res = [];
      for (i = 0; i < node.expressions.length; ++i) {
        res.push(node.expressions[i]);
      }
      return res;

    case 'UnaryExpression':
    case 'UpdateExpression':
      return [node.argument];

    case 'BinaryExpression':
    case 'AssignmentExpression':
    case 'AssignmentPattern':
    case 'LogicalExpression':
      return [node.left, node.right];

    case 'ConditionalExpression':
      return [node.test, node.consequent, node.alternate];

    case 'NewExpression':
    case 'CallExpression':
      res = [node.callee];
      if (!node.arguments) return res;
      for (i = 0; i < node.arguments.length; i++) {
        res.push(node.arguments[i]);
      }
      return res;

    case 'MemberExpression':
      res = [];
      if (node.object) res.push(node.object);
      if (node.computed && node.property) res.push(node.property);
      return res;

    case 'TaggedTemplateExpression':
      res = [];
      if (node.tag) res.push(node.tag);
      if (node.quasi) res.push(node.quasi);
      return res;

    case 'ClassDeclaration':
    case 'ClassExpression':
      res = [];
      if (node.superClass) res.push(node.superClass);
      if (node.id) res.push(node.id);
      if (!node.body.body) return res;
      for (i = 0; i < node.body.body.length; i++) {
        res.push(node.body.body[i]);
      }
      return res;

    case 'MethodDefinition':
      res = [];
      if (node.computed && node.key) res.push(node.key);
      if (node.value) res.push(node.value);
      return res;

    case 'ComprehensionExpression':
      res = [];
      for (i = 0; i < node.blocks.length; i++) {
        res.push(node.blocks[i].right);
      }
      if (node.body) res.push(node.body);
      return res;

    case 'RestElement':
      return (node.argument) ? [node.argument] : [];

    case 'ExportNamedDeclaration':
    case 'ExportDefaultDeclaration':
    case 'ExportAllDeclaration':
      res = [];
      if (node.source) res.push(node.source);
      if (node.declaration) res.push(node.declaration);
      return res;

    case 'ImportDeclaration':
      res = [];
      if (node.specifiers) {
        for (i = 0; i < node.specifiers.length; i++) {
          res.push(node.specifiers[i]);
        }
      }
      if (node.source) res.push(node.source);
      return res;

    default:
      return [];
  }
};
