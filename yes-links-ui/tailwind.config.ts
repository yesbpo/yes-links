import type { Config } from "tailwindcss";

export default {
  // Rule 4: Zero-Conflict Styling for SDK
  prefix: 'yes-link-',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--yes-primary)",
          foreground: "var(--yes-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--yes-secondary)",
          foreground: "var(--yes-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--yes-destructive)",
          foreground: "var(--yes-destructive-foreground)",
        },
        warning: {
          DEFAULT: "var(--yes-warning)",
          foreground: "var(--yes-warning-foreground)",
        },
        info: {
          DEFAULT: "var(--yes-info)",
          foreground: "var(--yes-info-foreground)",
        },
        muted: {
          DEFAULT: "var(--yes-muted)",
          foreground: "var(--yes-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--yes-accent)",
          foreground: "var(--yes-accent-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--yes-radius)",
        md: "calc(var(--yes-radius) - 2px)",
        sm: "calc(var(--yes-radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-yes-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
