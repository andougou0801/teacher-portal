import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import globals from "globals";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // ★ゲーム本体（public/study-game）も 見る。
  //   ここを 見ていなかったため、同じ名前の const を 2回 書いただけで
  //   アプリが まっ白に なったのに lint も build も 通ってしまった。
  //   ビルドしない ふつうの ブラウザ用 JavaScript なので、別あつかいにする。
  {
    files: ["public/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.serviceworker },
    },
    rules: {
      "no-undef": "error",
      "no-redeclare": "error",
      "no-unused-vars": ["warn", { args: "none" }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
