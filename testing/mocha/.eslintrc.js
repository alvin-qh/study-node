module.exports = {
  "env": {
    "node": true,
    "es2021": true,
    "jest": true,
  },
  "extends": "eslint:recommended",
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
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
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
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
