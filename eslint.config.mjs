import globals from "globals";
import pluginJs from "@eslint/js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      "no-console": "warn",
    },
  },
  pluginJs.configs.recommended,
];
