// @ts-check
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import dotenv from "dotenv";
import inquirer from "inquirer";

const DOTENV_PATH = path.resolve(".env");

/** validates database name
 * @param {string} str database name
 * @returns {true | string} returns true or an error
 */
function validName(str) {
  if (str.length < 4) return "must be at least 4 characters";
  if (str !== str.toLowerCase()) return "must be lowercase";
  return true;
}

/** generates a password
 * @param {number} length password length
 * @param {BufferEncoding} type password encoding
 * @returns {string} generated password
 */
function generatePassword(length, type = "base64") {
  return crypto.randomBytes(length).toString(type).replace(/\W/g, "_").toLowerCase();
}

async function readDotenv() {
  let buffer = null;
  try {
    buffer = await fs.readFile(DOTENV_PATH);
  } catch (e) {
    /* noop */
  }
  const config = buffer ? dotenv.parse(buffer) : {};
  // also read from current env, because docker-compose already needs to know some of it
  // eg. $PG_DUMP, $CONFIRM
  return { ...config, ...process.env };
}

/**
 * @param {Record<string,string | undefined>} config current environment object
 * @returns {Promise<void>} void
 */
async function createConfig(config) {
  const packageJson = JSON.parse(await fs.readFile("./package.json", "utf8"));
  const packageName = packageJson.name.replace(/\W/g, "_").replace(/__+/g, "");

  const {
    ROOT_DATABASE_USER,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_OWNER,
    DATABASE_AUTHENTICATOR,
    DATABASE_VISITOR,
    PORT,
    ROOT_URL,
  } = await inquirer.prompt(
    [
      {
        name: "ROOT_DATABASE_USER",
        message: "superuser database username:",
        default: "postgres",
        prefix: "",
      },
      {
        name: "DATABASE_HOST",
        message: "database host:",
        default: "localhost:5435",
        prefix: "",
      },
      {
        name: "DATABASE_NAME",
        message: "database name:",
        default: packageName,
        validate: validName,
        prefix: "",
      },
      {
        name: "DATABASE_OWNER",
        message: "database username:",
        default: prompt => prompt.DATABASE_NAME,
        prefix: "",
      },
      {
        name: "DATABASE_AUTHENTICATOR",
        message: "authenticator role name:",
        default: "authenticator",
        prefix: "",
      },
      {
        name: "DATABASE_VISITOR",
        message: "visitor role name:",
        default: "visitor",
        prefix: "",
      },
      {
        name: "PORT",
        message: "application port:",
        default: "3000",
        prefix: "",
      },
      {
        name: "ROOT_URL",
        message: "application url:",
        default: prompt => `http://localhost:${prompt.PORT}`,
        prefix: "",
      },
    ],
    config,
  );

  let PASSWORDS = {
    ROOT_DATABASE_PASSWORD: config?.ROOT_DATABASE_PASSWORD,
    DATABASE_OWNER_PASSWORD: config?.DATABASE_OWNER_PASSWORD,
    DATABASE_AUTHENTICATOR_PASSWORD: config?.DATABASE_AUTHENTICATOR_PASSWORD,
    SHADOW_DATABASE_PASSWORD: config?.SHADOW_DATABASE_PASSWORD,
    SECRET: config?.SECRET,
  };

  if (!Object.values(PASSWORDS).every(Boolean)) {
    const { genpwd } = await inquirer.prompt({
      name: "genpwd",
      message: "generate passwords?",
      type: "confirm",
      prefix: "",
    });
    PASSWORDS = genpwd
      ? {
          ROOT_DATABASE_PASSWORD: generatePassword(18),
          DATABASE_OWNER_PASSWORD: generatePassword(18),
          DATABASE_AUTHENTICATOR_PASSWORD: generatePassword(18),
          SHADOW_DATABASE_PASSWORD: generatePassword(18),
          SECRET: generatePassword(32, "hex"),
        }
      : await inquirer.prompt(
          [
            {
              name: "ROOT_DATABASE_PASSWORD",
              default: () => generatePassword(18),
              prefix: "",
            },
            {
              name: "DATABASE_OWNER_PASSWORD",
              default: () => generatePassword(18),
              prefix: "",
            },
            {
              name: "DATABASE_AUTHENTICATOR_PASSWORD",
              default: () => generatePassword(18),
              prefix: "",
            },
            {
              name: "SHADOW_DATABASE_PASSWORD",
              default: () => generatePassword(18),
              prefix: "",
            },
            {
              name: "SECRET",
              default: () => generatePassword(32, "hex"),
              prefix: "",
            },
          ],
          PASSWORDS,
        );
  }
  const ROOT_DATABASE_URL = `postgres://${ROOT_DATABASE_USER}:${PASSWORDS.ROOT_DATABASE_PASSWORD}@${DATABASE_HOST}/template1`;
  const DATABASE_URL = `postgres://${DATABASE_OWNER}:${PASSWORDS.DATABASE_OWNER_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}`;
  const AUTH_DATABASE_URL = `postgres://${DATABASE_AUTHENTICATOR}:${PASSWORDS.DATABASE_AUTHENTICATOR_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}`;
  const SHADOW_DATABASE_URL = `postgres://${DATABASE_NAME}_shadow:${PASSWORDS.SHADOW_DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}`;

  const envFile = `NODE_ENV=development
ROOT_DATABASE_USER=${ROOT_DATABASE_USER}
ROOT_DATABASE_PASSWORD=${PASSWORDS.ROOT_DATABASE_PASSWORD}
ROOT_DATABASE_URL=${ROOT_DATABASE_URL}
DATABASE_HOST=${DATABASE_HOST}
DATABASE_NAME=${DATABASE_NAME}
DATABASE_OWNER=${DATABASE_OWNER}
DATABASE_OWNER_PASSWORD=${PASSWORDS.DATABASE_OWNER_PASSWORD}
DATABASE_URL=${DATABASE_URL}
DATABASE_AUTHENTICATOR=${DATABASE_AUTHENTICATOR}
DATABASE_AUTHENTICATOR_PASSWORD=${PASSWORDS.DATABASE_AUTHENTICATOR_PASSWORD}
SHADOW_DATABASE_PASSWORD=${PASSWORDS.SHADOW_DATABASE_PASSWORD}
SHADOW_DATABASE_URL=${SHADOW_DATABASE_URL}
AUTH_DATABASE_URL=${AUTH_DATABASE_URL}
DATABASE_VISITOR=${DATABASE_VISITOR}
SECRET=${PASSWORDS.SECRET}
PORT=${PORT}
ROOT_URL=${ROOT_URL}
GITHUB_KEY=${config?.GITHUB_KEY || ""}
GITHUB_SECRET=${config?.GITHUB_SECRET || ""}
`;
  await fs.writeFile(DOTENV_PATH, envFile, "utf8");
  console.log(`.env file ${config ? "updated" : "created"}`);
}

async function main() {
  createConfig(await readDotenv());
}

main();
