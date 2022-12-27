module.exports = {
  root: true,
  env: { node: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "tsconfig.json", sourceType: "module" },
  plugins: ["@typescript-eslint/eslint-plugin", "unused-imports"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  rules: {
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
    quotes: ["error", "double"]
  },
};
