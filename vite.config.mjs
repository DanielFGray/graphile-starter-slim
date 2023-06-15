import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      plugins: [
        // this segfaults for some reason
        // ['@graphql-codegen/client-preset-swc-plugin', { artifactDirectory: './src/generated', gqlTagName: 'graphql' }],
      ],
    }),
  ],
});
