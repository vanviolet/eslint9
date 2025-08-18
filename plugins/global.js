import Globals from "globals";
/** @type {import("eslint").Linter.Config} */
export default [
  {
    languageOptions: {
      globals: {
        ...Globals.node,
      },
    },
  },
];
