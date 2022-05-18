"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = npmResolve;
exports.parseCode = parseCode;

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _generator = _interopRequireDefault(require("@babel/generator"));

var _parser = require("@babel/parser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseCode(code, extname = 'jsx') {
  const plugins = ['classProperties', 'objectRestSpread', 'optionalChaining', ['decorators', {
    decoratorsBeforeExport: true
  }], 'classPrivateProperties', 'doExpressions', 'exportDefaultFrom', 'exportNamespaceFrom', 'throwExpressions'];

  if (extname === '.ts') {
    plugins.push('typescript');
  } else if (extname === '.tsx') {
    plugins.push('typescript');
    plugins.push('jsx');
  } else {
    plugins.push('flow');
    plugins.push('jsx');
  }

  return (0, _parser.parse)(code, {
    sourceType: 'module',
    plugins
  });
}

async function npmResolve(code, filePath) {
  // 解析
  const ast = parseCode(code); // 遍历

  (0, _traverse.default)(ast, {}); // 生成

  return (0, _generator.default)(ast).code;
}