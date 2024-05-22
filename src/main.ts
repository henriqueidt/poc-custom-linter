import { tokenize } from "./tokenizer";
import * as fs from "fs";
import * as path from "path";
import { parseFile } from "./fileParser";

const dataFilePath = path.join(__dirname, "./data/example1.js");
const data: string = fs.readFileSync(dataFilePath, "utf-8");
const newData = parseFile(data);
console.log(newData);
// const outputFilePath = path.join(__dirname, "./data/example1-tokenized.txt");
// fs.writeFileSync(outputFilePath, newData.toString());
