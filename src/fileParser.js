"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = void 0;
var tokenizer_1 = require("./tokenizer");
var parseFile = function (data) {
    // const lines = data.split("\n");
    return (0, tokenizer_1.tokenize)(data);
    // return lines.map((line) => {
    //   return tokenize(line);
    // });
};
exports.parseFile = parseFile;
