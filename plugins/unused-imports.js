import UnusedImports from "eslint-plugin-unused-imports";

/** @type {import("eslint").Linter.Config} */
export default [
  {
    plugins: {
      "unused-imports": UnusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
