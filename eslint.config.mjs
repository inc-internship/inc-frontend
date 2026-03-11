import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/shared/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/entities/*",
                "@/entities/**",
                "@/features/*",
                "@/features/**",
                "@/widgets/*",
                "@/widgets/**",
                "@/views/*",
                "@/views/**",
                "@/app/*",
                "@/app/**",
              ],
              message:
                "Layer rule: shared cannot depend on entities/features/widgets/views/app.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/entities/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*",
                "@/features/**",
                "@/widgets/*",
                "@/widgets/**",
                "@/views/*",
                "@/views/**",
                "@/app/*",
                "@/app/**",
              ],
              message:
                "Layer rule: entities cannot depend on features/widgets/views/app.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/widgets/*",
                "@/widgets/**",
                "@/views/*",
                "@/views/**",
                "@/app/*",
                "@/app/**",
              ],
              message: "Layer rule: features cannot depend on widgets/views/app.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/widgets/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/views/*", "@/views/**", "@/app/*", "@/app/**"],
              message: "Layer rule: widgets cannot depend on views/app.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/views/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "@/app/**"],
              message: "Layer rule: pages cannot depend on app.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
