module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    // 'import',
    // 'jsx-a11y',
    // 'react',
    // 'react-hooks',
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    // 'plugin:import/recommended',
    // 'plugin:jsx-a11y/recommended',
    // 'plugin:react/recommended',
    // 'plugin:react-hooks/recommended',
    "plugin:@typescript-eslint/recommended",
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    "@remix-run/eslint-config",
  ],
  env: {
    node: true,
    browser: true,
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
    // 'import/extensions': extensions,
    // 'import/parsers': {
    //   '@typescript-eslint/parser': extensions,
    // },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: false,
        project: "tsconfig.json",
      },
    },
  },
  parserOptions: {
    project: "tsconfig.json",
  },
  ignorePatterns: ["./*/build/*", "./node_modules/"],
  rules: {},
};
