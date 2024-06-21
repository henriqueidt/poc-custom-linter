import {
	parse,
	Function,
	Identifier,
	MemberExpression,
	Node,
	VariableDeclarator,
} from 'acorn';
import { traverse } from 'estraverse';
import { red, yellow, gray } from 'chalk';
// import { defaultRules, RuleType, RuleName, onLeaveFunction } from './rules';

export type RuleType = 'warn' | 'error';
export type RuleName = 'no-console' | 'no-undef';
export type Rule = {
	name: RuleName;
	type: RuleType;
	message: string;
	condition: (node: any, panrent?: Node) => boolean;
};
// export type Node = {
//   type: string;
//   object: { name: string };
// };

const declaredVariables = new Map();
const scopeStack: string | any[] = [new Set()];

let currentLevel = 0;

const addNodeToStack = (nodeName?: string) => {
	declaredVariables.set(nodeName, currentLevel);
	// if (scopeStack.length > 0) {
	// scopeStack[scopeStack.length - 1].add(nodeName);
	// }
};

export const onLeaveFunction = () => {
	currentLevel--;
};

export const defaultRules: Rule[] = [
	{
		name: 'no-console',
		type: 'warn',
		message: 'Unexpected console statement',
		condition: (node: MemberExpression) =>
			node.type === 'MemberExpression' &&
			'name' in node.object &&
			node.object.name === 'console',
	},
	{
		name: 'no-undef',
		type: 'error',
		message: 'Unexpected undefined variable',
		// eslint-disable-next-line @typescript-eslint/ban-types
		condition: (node: VariableDeclarator | Function | Identifier, parent?: Node) => {
			if (
				node.type === 'VariableDeclarator' &&
				'id' in node &&
				node.id && // Q: can we use type guards in a more elegant way?
				'name' in node.id
			) {
				addNodeToStack(node.id.name);
			} else if (
				node.type === 'FunctionDeclaration' ||
				node.type === 'FunctionExpression' ||
				node.type === 'ArrowFunctionExpression'
			) {
				addNodeToStack(node.id?.name);
				currentLevel++;
				node.params.forEach((param) => {
					if (param.type === 'Identifier') {
						addNodeToStack(param.name);
					}
				});
			} else if (
				node.type === 'Identifier' &&
				parent?.type !== 'VariableDeclarator' && // variable declaration
				parent?.type !== 'MemberExpression' && // accessing a property of an object
				parent?.type !== 'FunctionDeclaration' && // function declaration
				parent?.type !== 'Property' && // setting a property of an object
				'name' in node
			) {
				if (
					(node.name && !declaredVariables.has(node.name)) ||
					declaredVariables.get(node.name) > currentLevel
				) {
					return true;
				}
			}
			return false;
		},
	},
];

interface Result {
	message: string;
	line?: number;
	column?: number;
	type: RuleType;
	rule: RuleName;
	start?: { line: number; column: number };
	end?: { line: number; column: number };
}

export const parseFile = (data: string, filePath: string) => {
	// console.log(data);
	try {
		let token;
		const results: Result[] = [];
		// const ast = parse(data, { ecmaVersion: "latest", locations: true });
		const ast = parse(data, { ecmaVersion: 'latest', locations: true });
		// @ts-expect-error aefaefaef
		traverse(ast, {
			enter: function (node: Node, parent?: Node) {
				// console.log(node);
				defaultRules.forEach((rule) => {
					if (rule.condition(node, parent)) {
						results.push({
							line: node.loc?.start.line,
							start: node.loc?.start,
							end: node.loc?.end,
							// Adding 1 to column as it is 0-based and eslint is 1-based
							column: node.loc?.start.column || 0 + 1,
							type: rule.type,
							rule: rule.name,
							message: rule.message,
						});
					}
				});
			},
			leave: function (node: Node, parent?: Node) {
				if (node.type === 'FunctionDeclaration') {
					onLeaveFunction();
				}
			},
		});

		// if (results.length > 0) {
		// 	console.log(`\n${filePath}`);
		// 	results.forEach((result) => {
		// 		if (result.type === 'error') {
		// 			console.log(
		// 				`  ${gray(`${result.line}:${result.column}`)} ${red('error')} ${
		// 					result.message
		// 				}  ${gray(result.rule)}`
		// 			);
		// 		} else {
		// 			console.log(
		// 				`  ${gray(`${result.line}:${result.column}`)} ${yellow('warning')}  ${
		// 					result.message
		// 				}  ${gray(result.rule)}`
		// 			);
		// 		}
		// 	});
		// } else {
		// 	console.log('No issues found.');
		// }
		return results;
	} catch (error) {
		return [];
	}
};
