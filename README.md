# @vanviolet/eslint9

![npm](https://img.shields.io/npm/v/@vanviolet/eslint9)
![license](https://img.shields.io/npm/l/@vanviolet/eslint9)

Konfigurasi ESLint yang dapat digunakan sebagai dasar dalam proyek JavaScript/TypeScript.

## Instalasi

Gunakan salah satu perintah berikut untuk menginstal package ini:

```sh
npm install --save-dev @vanviolet/eslint9
```

atau jika menggunakan yarn:

```sh
yarn add -D @vanviolet/eslint9
```

## Penggunaan (Flat Config ESLint 9)

Buat `eslint.config.mjs` dengan isi:

```mjs
import { default as DefaultConfiguration } from '@vanviolet/eslint9';

/** @type {import("eslint").Linter.Config} */
export default [
  ...DefaultConfiguration,
  // Tambahkan konfigurasi lainnya di bawah ini
  {},
];
```

Atau jika ingin format CommonJS, gunakan `eslint.config.cjs` berikut:

```js
/** @type {import("eslint").Linter.Config} */
module.exports = (async () => {
  const { default: DefaultConfiguration } = await import('@vanviolet/eslint9');
  return [
    ...DefaultConfiguration,
    // Tambahkan konfigurasi lainnya di bawah ini
    {},
  ];
})();
```

## CLI

Inisialisasi cepat dengan prompt:

```sh
# Jika paket ini sudah terpasang di project (devDependency):
npx vlint init

# One-off tanpa menginstal ke project:
npx -y @vanviolet/eslint9@latest vlint init
```

Perintah ini akan:
- Menanyakan format config (mjs/cjs, default mjs)
- Opsi generate .vscode/settings.json (default yes) dan merge hanya kunci yang sama
- Membuat/mengganti `eslint.config.[mjs|cjs]`

## Lisensi

[MIT](LICENSE)