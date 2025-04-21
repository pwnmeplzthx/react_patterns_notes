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
          pattern: "router"
        },
        {
          type: "modules",
          pattern: "modules/*",
          capture: ["module"]
        },
        {
          type: "interfaces",
          pattern: "interfaces/*"
        }
      ],
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true
        }
      }
    },
    rules: {
      "boundaries/entry-point": [
        2,
        {
          default: "disallow",
          rules: [
            {
              target: ["modules", "router"],
              allow: "index.ts"
            },
            {
              target: ["interfaces"],
              allow: "*"
            }
          ]
        }
      ],
      "boundaries/element-types": [
        2,
        {
          // disallow importing any element by default
          default: "allow",
          rules: [
            {
              from: ["interfaces"],
              disallow: ["router", "modules"]
            },
            {
              from: ["modules"],
              disallow: ["router"]
            },
            {
              from: ["modules"],
              message: "Module must not import other module",
              disallow: [
                [
                  "modules",
                  {
                    module: "!${module}"
                  }
                ]
              ]
            }
          ]
        }
      ]
    }
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended
]);
