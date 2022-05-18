import traverse from '@babel/traverse';
import generator from '@babel/generator';
import { parse, ParserPlugin } from '@babel/parser';

export function parseCode(code, extname = 'jsx') {
    const plugins: ParserPlugin[] = [
        'classProperties',
        'objectRestSpread',
        'optionalChaining',
        ['decorators', { decoratorsBeforeExport: true }],
        'classPrivateProperties',
        'doExpressions',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'throwExpressions',
    ];

    if (extname === '.ts') {
        plugins.push('typescript');
    } else if (extname === '.tsx') {
        plugins.push('typescript');
        plugins.push('jsx');
    } else {
        plugins.push('flow');
        plugins.push('jsx');
    }

    return parse(code, {
        sourceType: 'module',
        plugins,
    });
}

export default async function npmResolve(code, filePath) {
    // 解析
    const ast = parseCode(code);
    // 遍历
    traverse(ast, {});
    // 生成
    return generator(ast).code;
}