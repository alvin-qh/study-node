module.exports = {
  "env": {
    "es2021": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  "overrides": [
    {
      "files": [
        "src/**/*.js",
        ".eslintrc.{js,cjs}"
      ],
      "rules": {
        "simple-import-sort/imports": "off"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "simple-import-sort"
  ],
  "rules": {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "linebreak-style": ["error", "unix"],
    "indent": ["warn", 2, { "ignoredNodes": ["PropertyDefinition"] }],
    "quotes": ["warn", "double"],
    "semi": ["error", "always"],
    "sort-imports": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  }
}
