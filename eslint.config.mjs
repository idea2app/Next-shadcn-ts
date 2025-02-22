import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const baseDirectory = dirname(__filename);

const compat = new FlatCompat({ baseDirectory });

const eslintConfig = [
  ...compat.config({
    // config of next and prettier
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    // plugins
    plugins: ["simple-import-sort", "@cspell"],
    rules: {
      // built in
      "arrow-body-style": ["error", "as-needed"],
      "no-empty-pattern": "warn",
      "consistent-return": "warn",
      // next
      "@next/next/no-sync-scripts": "warn",
      // react
      "react/no-unescaped-entities": "off",
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "react/jsx-no-target-blank": "warn",
      "react/jsx-sort-props": [
        "error",
        {
          reservedFirst: true,
          callbacksLast: true,
          noSortAlphabetically: true,
        },
      ],
      // typescript
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-declaration-merging": "warn",

      // simple-import-sort
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
      // spellchecker
      "@cspell/spellchecker": [
        "warn",
        {
          cspell: {
            language: "en",
            dictionaries: ["typescript", "node", "html", "css", "bash", "npm"],
          },
        },
      ],
    },
    // latest version of ECMAScript
    parserOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
    },
    ignorePatterns: ["node_modules", ".next", "public"],
  }),
];

export default eslintConfig;
