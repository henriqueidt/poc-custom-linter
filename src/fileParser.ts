import { tokenize } from "./tokenizer";
import { parse, Node } from "acorn";
import * as espree from "espree";
import { traverse } from "estraverse";
import { red, yellow, gray } from "chalk";
import { defaultRules, RuleType, RuleName, onLeaveFunction } from "./rules";

interface Result {
  message: string;
  line?: number;
  column?: number;
  type: RuleType;
  rule: RuleName;
}

export const parseFile = (data: string, filePath: string) => {
  let token;
  let results: Result[] = [];
  // const ast = parse(data, { ecmaVersion: "latest", locations: true });
  const ast = parse(data, { ecmaVersion: "latest", locations: true });
  traverse(ast, {
    enter: function (node: Node, parent?: Node) {
      // console.log(node);
      defaultRules.forEach((rule) => {
        if (rule.condition(node, parent)) {
          results.push({
            line: node.loc?.start.line,
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
      if (node.type === "FunctionDeclaration") {
        onLeaveFunction();
      }
    },
  });

  if (results.length > 0) {
    console.log(`\n${filePath}`);
    results.forEach((result) => {
      if (result.type === "error") {
        console.log(
          `  ${gray(`${result.line}:${result.column}`)} ${red("error")} ${
            result.message
          }  ${gray(result.rule)}`
        );
      } else {
        console.log(
          `  ${gray(`${result.line}:${result.column}`)} ${yellow("warning")}  ${
            result.message
          }  ${gray(result.rule)}`
        );
      }
    });
  } else {
    console.log("No issues found.");
  }
};
