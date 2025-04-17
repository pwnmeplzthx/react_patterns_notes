import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import boundaries from "eslint-plugin-boundaries";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off"
    }
  },
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        {
          type: "router",
          pattern: "router",
        },
        {
          type: "tasks-list",
          pattern: "tasks-list",
        },
        {
          type: "tracks-modal",
          pattern: "tracks-modal",
        },
        {
          type: "tracks-table",
          pattern: "tracks-table",
        },
      ],
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "boundaries/entry-point": [
        2,
        {
          default: "disallow",
          rules: [
            {
              target: ["tracks-table", "tasks-list", "tracks-modal", "router"],
              allow: "index.ts",
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended
]);
