import { tokenize } from "./tokenizer";

export const parseFile = (data: string) => {
  return tokenize(data);
};
