module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
  },
  "extends": "eslint:recommended",
  "overrides": [
    {
      "files": [
        "*.js",
        ".eslintrc.{js,cjs}"
      ],
      "rules": {
        "simple-import-sort/imports": "off"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  "plugins": [
    "simple-import-sort",
  ],
  "rules": {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "linebreak-style": ["error", "unix"],
    "indent": ["warn", 2],
    "quotes": ["warn", "double"],
    "semi": ["error", "always"],
    "sort-imports": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  }
};
