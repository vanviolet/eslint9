# Configure agar bisa menggunakan cjs ataupun mjs

# Tambahkan fitur agar bisa npx vlint init
- Pertanyaan menggunakan cjs atau mjs default mjs
- Pertanyaan akan generate .vscode setting di repo yes/no default yes
- Generate file eslint.config.[cjs/mjs] dengan isi
```mjs
import { default as DefaultConfiguration } from '@vanviolet/eslint9';

/** @type {import("eslint").Linter.Config} */
export default [
  ...DefaultConfiguration,
  // Tambahkan konfigurasi lainnya di bawah ini
  {},
];
```
jika sudah ada file maka override filenya

- Generate file .vscode/settings.json dengan isi :
```json
{
  "eslint.useFlatConfig": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": true,
  "eslint.lintTask.enable": true,
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```
jika sudah ada file jangan maka jangan overide semua config hanya config yang sama saja
