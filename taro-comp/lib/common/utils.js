"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildBlockElement = buildBlockElement;
exports.default = slash;
exports.findMethodName = findMethodName;
exports.getRelativeAppPath = getRelativeAppPath;
exports.getRelativeComponentPath = getRelativeComponentPath;

var path = _interopRequireWildcard(require("path"));

var t = _interopRequireWildcard(require("@babel/types"));

var _const = require("../compile-core/const");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getRelativeAppPath(dir) {
  return path.relative(dir, path.join(_const.outputDir, "/npm/app.js"));
}

function getRelativeComponentPath(dir) {
  return path.relative(dir, path.join(_const.outputDir, "/npm/components.js"));
}

function findMethodName(expression) {
  let methodName;

  if (t.isMemberExpression(expression) && t.isIdentifier(expression.property)) {
    methodName = expression.property.name;
  } else {
    console.log("事件方法暂不支持该解析");
  }

  return methodName;
}

function buildBlockElement(attrs) {
  let blockName = "block";
  return t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier(blockName), attrs), t.jSXClosingElement(t.jSXIdentifier(blockName)), []);
}

function slash(path) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path);

  if (isExtendedLengthPath || hasNonAscii) {
    return path;
  }

  return path.replace(/\\/g, "/");
}