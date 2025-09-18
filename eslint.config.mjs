import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json", // optional, only if using TS
      },
      parser: "@typescript-eslint/parser",
      plugins: {
        "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // disable the rule
    },
  },
];

export default eslintConfig;
