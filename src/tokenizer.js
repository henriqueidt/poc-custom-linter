"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = void 0;
var constants_1 = require("./constants");
var createToken = function (type, value, row, col) {
    return {
        type: type,
        value: value,
        row: row,
        col: col,
    };
};
var createWhitespaceToken = function (value) {
    var whitespace = value;
    // we need to create the token before the while loop, to have the column value set at the beginning of the space
    var token = createToken("whitespace", "", row, col);
    while (line[0] === " ") {
        whitespace += getChar();
    }
    token.value = whitespace;
    return token;
};
var createStringToken = function (value) {
    var start = value;
    var isEscaped = false;
    // we need to create the token before the while loop, to have the column value set at the beginning of the string
    var token = createToken("string", value, row, col);
    while (true) {
        var char = getChar();
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
        }
        else {
            isEscaped = false;
        }
    }
    // should not get to this point
    return null;
};
var createWordToken = function (value) {
    var word = value;
    // we need to create the token before the while loop, to have the column value set at the beginning of the word
    var token = createToken("word", "", row, col);
    while (line !== "") {
        if (isWord(line[0]) || isDigit(line[0])) {
            word += getChar();
        }
        else {
            break;
        }
    }
    token.value = word;
    if (constants_1.KEYWORDS.indexOf(word) !== -1) {
        token.type = "keyword";
    }
    return token;
};
var createNumberToken = function (value) {
    var number = value;
    var hasDot = false;
    // we need to create the token before the while loop, to have the column value set at the beginning of the number
    var token = createToken("number", "", row, col);
    while (line !== "") {
        if (isDigit(line[0])) {
            number += getChar();
        }
        else if (line[0] === ".") {
            if (hasDot) {
                break;
            }
            hasDot = true;
            number += getChar();
        }
        else {
            break;
        }
    }
    token.value = number;
    return token;
};
// *******************************************
var lines;
var line = null;
var row = 0;
var col = 0;
var tokens = [];
var tokenize = function (data) {
    lines = data.split("\n");
    // lines = data;
    console.log(lines);
    getTokens();
    console.log(tokens);
};
exports.tokenize = tokenize;
var getTokens = function () {
    while (true) {
        var token = getToken();
        if (!token ||
            (token === null || token === void 0 ? void 0 : token.type) === "whitespace" ||
            (token === null || token === void 0 ? void 0 : token.type) === "multilineComment") {
            continue;
        }
        tokens.push(token);
        if (token.type === "EOF") {
            break;
        }
    }
};
var getToken = function () {
    var char = getChar();
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
var getChar = function () {
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
    var char = line[0];
    // reassings the line without first character
    line = line.slice(1);
    return char;
};
var goToNewLine = function () {
    if (lines.length === 0) {
        return;
    }
    // gets the next line, removing it from the lines array, increases the row and resets the col
    line = lines.shift();
    row++;
    col = 0;
};
var isWord = function (char) {
    var c = char.charCodeAt(0);
    // 65 - 90 are uppercase letters
    // 97 - 122 are lowercase letters
    // 95 is the underscore (_)
    if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95) {
        return true;
    }
    return false;
};
var isDigit = function (char) {
    if (char > "9" || char < "0") {
        return false;
    }
    return true;
};
