import EslintRecomended from "./plugins/eslint.js";
import GlobalRecomended from "./plugins/global.js";
import IgnoreRecomended from "./plugins/ignore.recommended.js";
import PrettierRecomended from "./plugins/prettier.js";
import TypescriptRecomended from "./plugins/typescript.js";
import UnusedImportsRecomended from "./plugins/unused-imports.js";
import OverrideEslintRules from "./override.js";

/** @type {import("eslint").Linter.Config} */
const EslintConfiguration = [
  ...EslintRecomended,
  ...GlobalRecomended,
  ...IgnoreRecomended,
  ...PrettierRecomended,
  ...TypescriptRecomended,
  ...UnusedImportsRecomended,
  ...OverrideEslintRules,
];

export default EslintConfiguration;

export { PrettierConfig } from "./prettier.config.js";
