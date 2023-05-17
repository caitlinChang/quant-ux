const docgen = require("react-docgen-typescript");
const path = require("path");
const fs = require("fs");

// const filePath = path.resolve(
//   __dirname,
//   "../../node_modules/antd/es/button/button.d.ts"
// );

const filePath = path.resolve(__dirname, "./test.tsx");

const options = {
  savePropValueAsString: true,
};

// Parse a file for docgen info
const res = docgen.parse(filePath, options);

fs.writeFileSync(
  path.resolve(__dirname, "./docgen.json"),
  JSON.stringify(res, null, 2)
);
