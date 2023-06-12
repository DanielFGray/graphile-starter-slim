import fs from "node:fs/promises";
import { lexicographicSortSchema, printSchema } from "graphql";
import pg from "pg";
import { makeSchema } from "postgraphile";
import { getPreset } from "../src/graphile.config";

const AUTH_DATABASE_URL = process.env.AUTH_DATABASE_URL;
if (!AUTH_DATABASE_URL) throw new Error("missing AUTH_DATABASE_URL env var");

async function main() {
  const authPgPool = new pg.Pool({
    connectionString: AUTH_DATABASE_URL,
  });

  const preset = {
    extends: [getPreset({ authPgPool })],
    schema: {
      // Turn off built-in schema exporting
      exportSchemaSDLPath: undefined,
      exportSchemaIntrospectionResultPath: undefined,
    },
  };

  try {
    const { schema } = await makeSchema(preset);
    await fs.mkdir("./src/generated", { recursive: true });
    await fs.writeFile(
      "./src/generated/schema.graphql",
      printSchema(lexicographicSortSchema(schema)) + "\n",
      { encoding: "utf8" },
    );
    console.log("GraphQL schema exported");
  } finally {
    authPgPool.end();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
