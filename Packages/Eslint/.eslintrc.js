module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier",
    "prettier/react"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.json",
    tsconfigRootDir : __dirname, 
  },
  plugins: ["@typescript-eslint", "prettier", "react"],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": [
      "off",
      {
        "semi": true,
        "trailingComma": "all",
        "singleQuote": false,
        "printWidth": 120,
        "arrowParens": "avoid"
      }
    ],
    "indent": ["off", "tab"],
    "linebreak-style": ["error", "unix"],
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "comma-dangle": ["error", "always-multiline"],
    "comma-spacing": "error",
    "comma-style": "error",
    "curly": ["error", "multi-line", "consistent"],
    "dot-location": ["error", "property"],
    "handle-callback-err": "off",
    "max-nested-callbacks": ["error", { "max": 6 }],
    "max-statements-per-line": ["error", { "max": 2 }],
    "no-console": "off",
    "no-empty-function": "error",
    "no-floating-decimal": "error",
    "no-inline-comments": "error",
    "no-lonely-if": "error",
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": [
      "error",
      { "max": 2, "maxEOF": 1, "maxBOF": 0 }
    ],
    "no-shadow": ["error", { "allow": ["err", "resolve", "reject"] }],
    "no-trailing-spaces": ["error"],
    "no-var": "off",
    "object-curly-spacing": ["error", "always"],
    "prefer-const": "error",
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "space-before-blocks": "error",
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
      }
    ],
    "space-in-parens": "error",
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "spaced-comment": "off",
    "yoda": "error"
  }
}
