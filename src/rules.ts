export type RuleType = "warn" | "error";
export type RuleName = "no-console" | "no-undef";
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
import {
  Function,
  Identifier,
  MemberExpression,
  Node,
  VariableDeclarator,
} from "acorn";

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
    name: "no-console",
    type: "warn",
    message: "Unexpected console statement",
    condition: (node: MemberExpression) =>
      node.type === "MemberExpression" &&
      "name" in node.object &&
      node.object.name === "console",
  },
  {
    name: "no-undef",
    type: "error",
    message: "Unexpected undefined variable",
    condition: (
      node: VariableDeclarator | Function | Identifier,
      parent?: Node
    ) => {
      if (
        node.type === "VariableDeclarator" &&
        "id" in node &&
        node.id && // Q: can we use type guards in a more elegant way?
        "name" in node.id
      ) {
        addNodeToStack(node.id.name);
      } else if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression"
      ) {
        addNodeToStack(node.id?.name);
        currentLevel++;
        node.params.forEach((param) => {
          if (param.type === "Identifier") {
            addNodeToStack(param.name);
          }
        });
      } else if (
        node.type === "Identifier" &&
        parent?.type !== "VariableDeclarator" && // variable declaration
        parent?.type !== "MemberExpression" && // accessing a property of an object
        parent?.type !== "FunctionDeclaration" && // function declaration
        parent?.type !== "Property" && // setting a property of an object
        "name" in node
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
