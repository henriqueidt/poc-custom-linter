import { KEYWORDS } from "./constants";

type TokenType =
  | "whitespace"
  | "comment"
  | "multilineComment"
  | "EOF"
  | "EOL"
  | "string"
  | "word"
  | "keyword"
  | "number";

interface Token {
  type: TokenType;
  value?: string;
  row: number;
  col: number;
}

const createToken = (
  type: TokenType,
  value: string,
  row: number,
  col: number
): Token => {
  return {
    type,
    value,
    row,
    col,
  };
};

const createWhitespaceToken = (value: string) => {
  let whitespace = value;
  // we need to create the token before the while loop, to have the column value set at the beginning of the space
  const token = createToken("whitespace", "", row, col);
  while (line[0] === " ") {
    whitespace += getChar();
  }
  token.value = whitespace;
  return token;
};

const createStringToken = (value: string): Token | undefined | null => {
  const start = value;
  let isEscaped = false;
  // we need to create the token before the while loop, to have the column value set at the beginning of the string
  const token = createToken("string", value, row, col);
  while (true) {
    const char = getChar();
    if (char === "\n") {
      break;
    }
    token.value += char;
    if (char === start && !isEscaped) {
      return token;
    }
    // need to check for scape character to interpret scaped things like "this is \" bla bla"
    if (char == "\\") {
      isEscaped = !isEscaped;
    } else {
      isEscaped = false;
    }
  }
  // should not get to this point
  return null;
};

const createWordToken = (value: string) => {
  let word = value;
  // we need to create the token before the while loop, to have the column value set at the beginning of the word
  const token = createToken("word", "", row, col);
  while (line !== "") {
    if (isWord(line[0]) || isDigit(line[0])) {
      word += getChar();
    } else {
      break;
    }
  }
  token.value = word;
  if (KEYWORDS.indexOf(word) !== -1) {
    token.type = "keyword";
  }
  return token;
};

const createNumberToken = (value: string) => {
  let number = value;
  let hasDot = false;
  // we need to create the token before the while loop, to have the column value set at the beginning of the number
  const token = createToken("number", "", row, col);
  while (line !== "") {
    if (isDigit(line[0])) {
      number += getChar();
    } else if (line[0] === ".") {
      if (hasDot) {
        break;
      }
      hasDot = true;
      number += getChar();
    } else {
      break;
    }
  }
  token.value = number;
  return token;
};

// *******************************************

let lines: any[];
let line: string | any[] | null = null;
let row = 0;
let col = 0;
let tokens: Token[] = [];

export const tokenize = (data: string) => {
  lines = data.split("\n");
  // lines = data;
  console.log(lines);
  getTokens();
  console.log(tokens);
};

const getTokens = () => {
  while (true) {
    const token = getToken();

    if (
      !token ||
      token?.type === "whitespace" ||
      token?.type === "multilineComment"
    ) {
      continue;
    }
    tokens.push(token);

    if (token.type === "EOF") {
      break;
    }
  }
};

const getToken = (): Token | undefined => {
  const char = getChar();

  switch (char) {
    case "":
      return createToken("EOF", "", row, col);
    case "\n":
      return createToken("EOL", char, row, col);
    case " ":
      return createWhitespaceToken(char);
    case '"':
    case "'":
      return createStringToken(char);
  }

  if (isWord(char)) {
    return createWordToken(char);
  }

  if (isDigit(char)) {
    return createNumberToken(char);
  }

  // const token = createToken();

  // if(token)
};

const getChar = () => {
  if (line === null) {
    goToNewLine();
  }
  // if after going to a new line it is still null, it means it's the end of the file
  if (line === null) {
    return "";
  }
  col++;
  // if line is an empty string, it means it's a new line
  if (line === "") {
    line = null;
    return "\n";
  }
  const char = line[0];
  // reassings the line without first character
  line = line.slice(1);
  return char;
};

const goToNewLine = () => {
  if (lines.length === 0) {
    return;
  }
  // gets the next line, removing it from the lines array, increases the row and resets the col
  line = lines.shift();
  row++;
  col = 0;
};

const isWord = (char: string) => {
  const c = char.charCodeAt(0);
  // 65 - 90 are uppercase letters
  // 97 - 122 are lowercase letters
  // 95 is the underscore (_)
  if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95) {
    return true;
  }
  return false;
};

const isDigit = (char: string) => {
  if (char > "9" || char < "0") {
    return false;
  }
  return true;
};
