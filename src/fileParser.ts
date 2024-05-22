import { tokenize } from "./tokenizer";

export const parseFile = (data: string) => {
  // const lines = data.split("\n");
  return tokenize(data);
  // return lines.map((line) => {
  //   return tokenize(line);
  // });
};
