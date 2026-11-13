import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next ships these as warnings (or off). `npm run lint` runs with
// --max-warnings=0, so a warning already fails CI; raising them to error keeps
// the severity honest if that flag ever moves.
const nextDefaultsRaisedToError = {
  "react/jsx-no-target-blank": "error",
  "jsx-a11y/alt-text": ["error", { elements: ["img"], img: ["Image"] }],
  "jsx-a11y/aria-props": "error",
  "jsx-a11y/aria-proptypes": "error",
  "jsx-a11y/aria-unsupported-elements": "error",
  "jsx-a11y/role-has-required-aria-props": "error",
  "jsx-a11y/role-supports-aria-props": "error",
  "@typescript-eslint/no-unused-vars": "error",
  "@typescript-eslint/no-unused-expressions": "error",
  "import/no-anonymous-default-export": "error",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    // Local Claude Code state, including agent worktrees that carry their own
    // node_modules and .next output:
    ".claude/**",
  ]),
  {
    name: "kenet.app/severity",
    rules: nextDefaultsRaisedToError,
  },
  {
    // Type-aware linting, restricted to the TypeScript extensions tsconfig.json
    // covers: the .mjs config files and scripts/*.mjs carry no type
    // information, and projectService would fail to place them in a program.
    name: "kenet.app/type-aware",
    files: ["**/*.{mts,ts,cts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
    },
  },
]);

export default eslintConfig;
