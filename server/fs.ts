import { utimes, open } from "node:fs/promises";

export const touch = async (filepath: string): Promise<void> => {
  try {
    const time = new Date();
    await utimes(filepath, time, time);
  } catch (err) {
    const filehandle = await open(filepath, "w");
    await filehandle.close();
  }
};
