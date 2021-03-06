"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TARO_PACKAGE_NAME = exports.TARO_COMPONENTS_NAME = void 0;
exports.transform = transform;

var _npmResolve = require("../common/npmResolve");

var t = _interopRequireWildcard(require("@babel/types"));

var fse = _interopRequireWildcard(require("fs-extra"));

var npath = _interopRequireWildcard(require("path"));

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _generator = _interopRequireDefault(require("@babel/generator"));

var _compileRender = require("./compileRender");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const TARO_PACKAGE_NAME = "react";
exports.TARO_PACKAGE_NAME = TARO_PACKAGE_NAME;
const TARO_COMPONENTS_NAME = "@taro/components";
exports.TARO_COMPONENTS_NAME = TARO_COMPONENTS_NAME;

function transform(props) {
  const {
    code,
    sourceDirPath,
    relativeAppPath
  } = props; // ?????????ast

  const ast = (0, _npmResolve.parseCode)(code); // ????????????wxml

  let outTemplate = null; // ????????????wxss

  let style = null; // ???????????????????????????????????????????????????????????????render????????????

  let renderPath = null; // ??????????????????

  let initState = new Set(); // ???????????????????????????????????????

  let className = "";
  (0, _traverse.default)(ast, {
    ClassDeclaration(path) {
      // ??????????????????????????????????????????
      className = path.node.id.name;
    },

    ClassMethod(path) {
      if (t.isIdentifier(path.node.key)) {
        const node = path.node;
        const methodName = node.key.name;

        if (methodName === "render") {
          // ??????render?????????createData,??????????????????
          renderPath = path;
          path.node.key.name = "createData";
        }

        if (methodName === "constructor") {
          path.traverse({
            AssignmentExpression(p) {
              if (t.isMemberExpression(p.node.left) && t.isThisExpression(p.node.left.object) && t.isIdentifier(p.node.left.property) && p.node.left.property.name === "state" && t.isObjectExpression(p.node.right)) {
                // ?????? this.state
                const properties = p.node.right.properties;
                properties.forEach(p => {
                  if (t.isObjectProperty(p) && t.isIdentifier(p.key)) {
                    initState.add(p.key.name);
                  }
                });
              }
            }

          });
        }
      }
    },

    ImportDeclaration(path) {
      const source = path.node.source.value;

      if (source === TARO_PACKAGE_NAME) {
        // ????????????????????????????????????????????????????????????????????????????????????
        path.node.source.value = relativeAppPath;
      }

      if (/css$/.test(source)) {
        // ????????????????????????????????????????????????rpx
        let cssPath = npath.join(sourceDirPath, source);
        style = fse.readFileSync(cssPath).toString().replace(/px/g, "rpx");
      }
    }

  }); // ???????????????????????????render?????????????????????

  outTemplate = (0, _compileRender.compileRender)(renderPath); // ????????????????????????????????????????????????

  ast.program.body = ast.program.body.filter(item => !(t.isImportDeclaration(item) && item.source.value === TARO_COMPONENTS_NAME) && !(t.isImportDeclaration(item) && /css$/.test(item.source.value))); // ????????????

  let codes = (0, _generator.default)(ast).code;
  const result = {
    code: "",
    json: "",
    style: "",
    className: "",
    wxml: ""
  };
  result.code = codes;
  result.json = `
    {
        "usingComponents": {}
    }
        `;
  result.wxml = outTemplate;
  result.style = style;
  result.className = className;
  return result;
}