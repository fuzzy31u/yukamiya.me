import {
  mkdir,
  readFile,
  writeFile,
  rename,
  open,
  rm,
  readdir,
  lstat,
} from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
export async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT" && fallback !== undefined) return fallback;
    throw e;
  }
}
export async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  try {
    if ((await lstat(file)).isSymbolicLink())
      throw new Error("symlink-destination");
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  const text = JSON.stringify(value, null, 2) + "\n";
  try {
    if ((await readFile(file, "utf8")) === text) return false;
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  const tmp = file + "." + randomUUID() + ".tmp";
  try {
    await writeFile(tmp, text, { flag: "wx" });
    await rename(tmp, file);
  } finally {
    await rm(tmp, { force: true });
  }
  return true;
}
export async function readRecords(dir) {
  await mkdir(dir, { recursive: true });
  const names = (await readdir(dir)).filter((n) => n.endsWith(".json")).sort();
  return Promise.all(
    names.map(async (name) => ({
      name,
      data: await readJson(path.join(dir, name)),
    })),
  );
}
export async function locked(root, fn) {
  await mkdir(root, { recursive: true });
  const file = path.join(root, ".lock");
  let handle;
  try {
    handle = await open(file, "wx");
    await handle.writeFile(String(process.pid));
    return await fn();
  } finally {
    if (handle) {
      await handle.close();
      await rm(file, { force: true });
    }
  }
}
