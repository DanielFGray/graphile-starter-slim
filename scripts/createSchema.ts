import fs from "node:fs/promises";
import { lexicographicSortSchema, printSchema } from "graphql";
import pg from "pg";
import { makeSchema } from "postgraphile";
import { getPreset } from "../server/graphile.config";

const AUTH_DATABASE_URL = process.env.AUTH_DATABASE_URL;
if (!AUTH_DATABASE_URL) throw new Error("missing AUTH_DATABASE_URL env var");

async function main() {
  if (await fs.stat("./app/generated/schema.graphql").catch(() => false)) {
    if (process.env.NOCONFIRM) {
      console.log("schema exists, skipping generation");
      process.exit(0);
    } else {
      const inquirer = (await import("inquirer")).default;
      const { overwrite } = await inquirer.prompt({
        name: "overwrite",
        message: "overwrite existing schema?",
        type: "confirm",
        prefix: "",
      });
      if (!overwrite) process.exit(0);
    }
  }

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
    await fs.mkdir("./app/generated", { recursive: true });
    await fs.writeFile(
      "./app/generated/schema.graphql",
      printSchema(lexicographicSortSchema(schema)) + "\n",
      { encoding: "utf8" },
    );
    console.log("GraphQL schema exported");
  } finally {
    await authPgPool.end();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
