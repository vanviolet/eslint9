#!/usr/bin/env node

/*
CLI: vlint init
- Ask default module type (mjs/cjs), default mjs
- Ask to generate .vscode settings (yes/no), default yes
- Generate eslint.config.[mjs|cjs]
- Merge or create .vscode/settings.json per spec
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [, , cmd] = process.argv;
  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    printHelp();
    process.exit(0);
  }

  switch (cmd) {
    case "init":
      await runInit();
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(
    `vlint - helpers for @vanviolet/eslint9\n\nUsage:\n  vlint init    Initialize ESLint flat config in the current repo\n`,
  );
}

async function runInit() {
  // Ask questions
  const response = await prompts(
    [
      {
        type: "select",
        name: "module",
        message: "Gunakan format config apa?",
        choices: [
          { title: "mjs (ESM)", value: "mjs" },
          { title: "cjs (CommonJS)", value: "cjs" },
        ],
        initial: 0, // default mjs
      },
      {
        type: "toggle",
        name: "vscode",
        message: "Generate .vscode settings di repo?",
        initial: true,
        active: "yes",
        inactive: "no",
      },
    ],
    {
      onCancel: () => {
        console.log("Dibatalkan.");
        process.exit(0);
      },
    },
  );

  const module = response.module || "mjs";
  const shouldVscode = response.vscode !== false; // default yes

  await generateEslintConfig(module);
  if (shouldVscode) await generateVscodeSettings();

  console.log("Selesai.");
}

async function generateEslintConfig(module) {
  const cwd = process.cwd();
  const filename = `eslint.config.${module}`;
  const target = path.join(cwd, filename);
  let content = "";

  if (module === "mjs") {
    content = `import { default as DefaultConfiguration } from '@vanviolet/eslint9';\n\n/** @type {import(\"eslint\").Linter.Config} */\nexport default [\n  ...DefaultConfiguration,\n  // Tambahkan konfigurasi lainnya di bawah ini\n  {},\n];\n`;
  } else {
    // CJS variant using dynamic import to load ESM package
    content = `/** @type {import(\"eslint\").Linter.Config} */\nmodule.exports = (async () => {\n  const { default: DefaultConfiguration } = await import('@vanviolet/eslint9');\n  return [\n    ...DefaultConfiguration,\n    // Tambahkan konfigurasi lainnya di bawah ini\n    {},\n  ];\n})();\n`;
  }

  await fs.promises.writeFile(target, content, "utf8");
  console.log(`Generated ${filename}`);
}

async function generateVscodeSettings() {
  const cwd = process.cwd();
  const dir = path.join(cwd, ".vscode");
  const file = path.join(dir, "settings.json");

  const desired = {
    "eslint.useFlatConfig": true,
    "eslint.validate": [
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact",
    ],
    "eslint.format.enable": true,
    "eslint.lintTask.enable": true,
    "eslint.workingDirectories": [{ mode: "auto" }],
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit",
    },
    "[javascript]": { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
    "[javascriptreact]": {
      "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    },
    "[typescript]": { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
    "[typescriptreact]": {
      "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    },
  };

  await fs.promises.mkdir(dir, { recursive: true });

  // Merge-only: if exists, only override same keys; keep others
  let existing = {};
  if (fs.existsSync(file)) {
    try {
      const raw = await fs.promises.readFile(file, "utf8");
      existing = JSON.parse(stripJsonComments(raw));
    } catch (e) {
      console.warn(
        ".vscode/settings.json tidak valid JSON, menimpa kunci yang diketahui.",
      );
    }
  }

  const merged = mergeSettings(existing, desired);
  await fs.promises.writeFile(
    file,
    `${JSON.stringify(merged, null, 2)}\n`,
    "utf8",
  );
  console.log("Updated .vscode/settings.json");
}

function mergeSettings(existing, desired) {
  const out = { ...existing };
  for (const [key, val] of Object.entries(desired)) {
    if (Array.isArray(val)) {
      out[key] = val; // replace arrays by spec
    } else if (isPlainObject(val)) {
      out[key] = { ...(existing[key] || {}), ...val };
    } else {
      out[key] = val;
    }
  }
  return out;
}

function isPlainObject(x) {
  return x && typeof x === "object" && !Array.isArray(x);
}

function stripJsonComments(data) {
  // Remove /* */ comments
  let out = data.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove // comments
  out = out.replace(/(^|\s)\/\/.*$/gm, "$1");
  return out;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
