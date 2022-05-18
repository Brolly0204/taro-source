"use strict";

var path = _interopRequireWildcard(require("path"));

var fse = _interopRequireWildcard(require("fs-extra"));

var _babel = _interopRequireDefault(require("../common/babel"));

var _const = require("./const");

var _buildSinglePage = require("../common/buildSinglePage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// const outputDir = path.resolve(__dirname, '../../dist');
// const inputRoot = path.join(path.resolve('.'), 'src')

/**
 *  检查目录等准备工作
 */
async function init() {
  fse.removeSync(_const.outputDir);
  fse.ensureDirSync(_const.outputDir);
}
/**
 *  输出project.config.json
 */


async function buildProjectConfig() {
  fse.writeFileSync(path.join(_const.outputDir, 'project.config.json'), `
{
    'miniprogramRoot': './',
    'projectname': 'app',
    'description': 'app',
    'appid': 'touristappid',
    'setting': {
        'urlCheck': true,
        'es6': false,
        'postcss': false,
        'minified': false
    },
    'compileType': 'miniprogram'
}
    `);
}
/**
 *  输出入口文件app.js与app.json
 */


async function buildEntry() {
  fse.writeFileSync(path.join(_const.outputDir, './app.js'), `App({})`);

  const config = require(path.resolve(_const.inputRoot, 'app.config.js'));

  fse.writeFileSync(path.join(_const.outputDir, './app.json'), JSON.stringify(config, undefined, 2));
}
/**
 * npm拷贝到输出目录
 */


async function copyNpmToWx() {
  const npmPath = path.resolve(__dirname, './npm');
  const allFiles = await fse.readdirSync(npmPath);
  console.log('allFiles', allFiles);
  allFiles.forEach(async fileName => {
    const fileContent = fse.readFileSync(path.join(npmPath, fileName)).toString();
    const outputNpmPath = path.join(_const.outputDir, `./npm/${fileName}`);
    let resCode = await (0, _babel.default)(fileContent, outputNpmPath);
    fse.ensureDirSync(path.dirname(outputNpmPath));
    fse.writeFileSync(outputNpmPath, resCode.code);
  });
}
/**
 *  页面生成4种输出到输出目录
 */


async function buildPages() {
  _const.config.pages.forEach(page => {
    (0, _buildSinglePage.buildSinglePage)(page);
  });
}

async function main() {
  // 检查目录等准备工作
  await init(); // npm拷贝到输出目录

  await copyNpmToWx(); // 页面生成4种输出到输出目录

  await buildPages(); // 输出入口文件app.js与app.json

  await buildEntry(); // 输出project.config.json

  await buildProjectConfig();
}

main();