module.exports = {
  "env": {
    "browser": true,
    "mocha": true,
    "node": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
    {
      "files": [
        "src/**/*.ts",
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      },
      "rules": {
        "simple-import-sort/imports": "off"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
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
