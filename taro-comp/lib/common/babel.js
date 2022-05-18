"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = babel;

var _core = require("@babel/core");

var _npmResolve = _interopRequireDefault(require("./npmResolve"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const babelOptions = {
  sourceMap: true,
  presets: ['@babel/preset-react'],
  plugins: [['minify-replace', {
    replacements: [{
      identifierName: '__DEV__',
      replacement: {
        type: 'numericLiteral',
        value: 0
      }
    }]
  }]]
};

async function babel(content, file) {
  content = await (0, _npmResolve.default)(content, file);
  let config = babelOptions;
  config.filename = file;
  return (0, _core.transformAsync)(content, config);
}