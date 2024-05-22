"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = void 0;
var createToken = function (type, value, row, col) {
    return {
        type: type,
        value: value,
        row: row,
        col: col,
    };
};
var lines;
var row;
var col;
var tokens = [];
var tokenize = function (data) {
    lines = data;
    lines.split("\n").forEach(function (line, row) {
        line.split("").forEach(function (char, col) {
            tokens.push(createToken("char", char, row, col + 1));
        });
    });
    console.log(tokens);
    // getToken();
    // return line;
};
exports.tokenize = tokenize;
// const getToken = () => {
// };
