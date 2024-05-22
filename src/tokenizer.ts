interface Token {
  type: string;
  value: string;
  row: number;
  col: number;
}

const createToken = (type: string, value: string, row: number, col: number) => {
  return {
    type,
    value,
    row,
    col,
  };
};

let lines;
let row: 0;
let col: 0;
let tokens: Token[] = [];

export const tokenize = (data: string) => {
  lines = data;
  lines.split("\n").forEach((line, row) => {
    line.split("").forEach((char, col) => {
      tokens.push(createToken("char", char, row, col + 1));
    });
  });

  console.log(tokens);
  // getToken();
  // return line;
};

// const getToken = () => {

// };
