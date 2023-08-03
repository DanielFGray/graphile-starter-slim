import path from "path";
import { run, makeWorkerUtils } from "graphile-worker";
import type { WorkerUtils, Runner } from "graphile-worker";
import type { Express } from "express";
import { getRootPgPool } from "./installDatabasePools";
import { getShutdownActions } from "../app";

let workerUtils: WorkerUtils;
let runner: Runner;

const taskDirectory = path.resolve("./worker/tasks");

export async function installWorkerUtils(app: Express): Promise<void> {
  const pgPool = getRootPgPool(app);
  workerUtils = await makeWorkerUtils({
    pgPool,
  });
  await workerUtils.migrate();

  app.set("workerUtils", workerUtils);
  runner = await run({ pgPool, taskDirectory });

  getShutdownActions(app).push(async () => {
    await runner.stop();
    await workerUtils.release();
  });

  // await runner.promise
}

export function getRunner(): Runner {
  return runner;
}

export function getWorkerUtils(app: Express): WorkerUtils {
  return app.get("workerUtils");
}
