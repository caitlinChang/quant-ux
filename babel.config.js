module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  overrides: [
    {
      test: "*.jsx|*.tsx",
      presets: ["@babel/preset-react", "@babel/preset-typescript"],
    },
  ],
};
