import { tokenize } from "./tokenizer";
import { parse } from "acorn";
import * as espree from "espree";
import { traverse } from "estraverse";
import { red, yellow, gray } from "chalk";

type ResultType = "warning" | "error";
type Rule = "no-console";

interface Result {
  message: string;
  line: number;
  column: number;
  type: ResultType;
  rule: Rule;
}

const onToken = (token: any) => {
  console.log(token);
};

export const parseFile = (data: string) => {
  let token;
  let results: Result[] = [];
  const ast = parse(data, { ecmaVersion: "latest", locations: true });
  // const ast = espree.parse(data, { ecmaVersion: "latest" });
  traverse(ast, {
    enter: function (node, parent) {
      console.log(node.type, node.name);
      // console.log(node);
      if (node.type === "MemberExpression" && node.object.name === "console") {
        results.push({
          message: "Unexpected console statement",
          line: node.loc.start.line,
          // Adding 1 to column because it is 0-based and eslint is 1-based
          column: node.loc.start.column + 1,
          type: "warning",
          rule: "no-console",
        });
      }
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
  // return acorn.parse(data, { ecmaVersion: "latest", onToken: onToken });
  // let tokenizer = acorn.tokenizer(data, { ecmaVersion: "latest" });
  // do {
  //   token = tokenizer.getToken();
  //   result.push(token);
  // } while (token.type !== acorn.tokTypes.eof);
  // return result;
  // return tokenize(data);
};
