export type RuleType = "warn" | "error";
export type RuleName = "no-console";
export type Rule = {
  name: RuleName;
  type: RuleType;
  message: string;
  condition: (node: any) => boolean;
};
export type Node = {
  type: string;
  object: { name: string };
};

export const defaultRules: Rule[] = [
  {
    name: "no-console",
    type: "warn",
    message: "Unexpected console statement",
    condition: (node: Node) =>
      node.type === "MemberExpression" && node.object.name === "console",
  },
];
