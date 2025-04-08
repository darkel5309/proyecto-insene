import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "19", // Asegúrate de que esté configurada la versión correcta de React
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Deshabilitar la necesidad de importar React
    },
  },
]);
