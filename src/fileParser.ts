import { tokenize } from "./tokenizer";
import { parse, Node } from "acorn";
import * as espree from "espree";
import { traverse } from "estraverse";
import { red, yellow, gray } from "chalk";
import { defaultRules, RuleType, RuleName } from "./rules";

interface Result {
  message: string;
  line?: number;
  column?: number;
  type: RuleType;
  rule: RuleName;
}

export const parseFile = (data: string) => {
  let token;
  let results: Result[] = [];
  const ast = parse(data, { ecmaVersion: "latest", locations: true });
  // const ast = espree.parse(data, { ecmaVersion: "latest" });
  traverse(ast, {
    enter: function (node: Node) {
      defaultRules.forEach((rule) => {
        if (rule.condition(node)) {
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
  });

  if (results.length > 0) {
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
