const ts = require("typescript");
const path = require("path");
const fs = require("fs");
const lodash = require("lodash");
// const filePath = path.resolve(
//   __dirname,
//   "../../node_modules/antd/es/button/index.d.ts"
// );
const filePath = path.resolve(__dirname, "test.ts");

const ast = ts.createSourceFile(
  "button.d.ts",
  fs.readFileSync(filePath).toString(),
  ts.ScriptTarget.ES2015,
  true,
  ts.ScriptKind.TS
);
console.log(ast.getT);

// fs.writeFileSync(
//   path.resolve(__dirname, "./parse.json"),
//   lodash.toString(ast, null, 2)
// );
