"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSinglePage = buildSinglePage;

var fse = _interopRequireWildcard(require("fs-extra"));

var path = _interopRequireWildcard(require("path"));

var _const = require("../compile-core/const");

var _babel = _interopRequireDefault(require("./babel"));

var _transform = require("../compile-core/transform");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function buildSinglePage(page) {
  const pagePath = path.join(_const.inputRoot, `${page}`);
  const pageJs = `${pagePath}.jsx`;
  const outPageDirPath = path.join(_const.outputDir, page);
  console.log(`开始处理：${_const.inputRoot}/${page} ...`);
  const code = fse.readFileSync(pageJs).toString();
  const outputPageJSPath = `${outPageDirPath}.js`;
  const outputPageJSONPath = `${outPageDirPath}.json`;
  const outputPageWXMLPath = `${outPageDirPath}.wxml`;
  const outputPageWXSSPath = `${outPageDirPath}.wxss`;
  const sourceDirPath = path.dirname(pagePath);
  const relativeAppPath = (0, _utils.getRelativeAppPath)(path.dirname(outPageDirPath));
  const relativeComponentsPath = (0, _utils.getRelativeComponentPath)(path.dirname(outPageDirPath));
  const result = (0, _transform.transform)({
    code,
    sourceDirPath,
    relativeAppPath,
    relativeComponentsPath
  });
  fse.ensureDirSync(path.dirname(outputPageJSPath));
  let resCode = await (0, _babel.default)(result.code, outputPageJSPath);
  result.code = `
${resCode.code}    
Page(require('${relativeAppPath}').createPage(${result.className}))
    `;
  fse.writeFileSync(outputPageJSONPath, result.json);
  console.log(`输出文件：${_const.outputDir}/${page}.json`);
  fse.writeFileSync(outputPageJSPath, result.code);
  console.log(`输出文件：${_const.outputDir}/${page}.js`);
  fse.writeFileSync(outputPageWXMLPath, result.wxml);
  console.log(`输出文件：${_const.outputDir}/${page}.wxml`);
  fse.writeFileSync(outputPageWXSSPath, result.style);
  console.log(`输出文件：${_const.outputDir}/${page}.wxss`);
}