import { join } from "path";
import { readJson, pathExists, ensureDir, copy } from "fs-extra";

/**
 * `console.log` messages if in development environment
 * @param params - Messages to log
 */
const log = (...params: any[]) =>
  process.env.NODE_ENV === "development" && console.log(...params);

export interface EjectSettings {
  sourceDir?: string;
  destDir?: string;
}

/**
 * Eject dependencies
 */
export const eject = async (settings: EjectSettings = {}) => {
  const nodeModulesDir = settings.sourceDir || join(".", "node_modules");
  const destDir = settings.destDir || join(".", "ejected");

  await ensureDir(destDir);
  if (!(await pathExists(nodeModulesDir)))
    throw new Error("node_modules not found");

  const pkg: {
    dependencies: {
      [index: string]: string;
    };
  } = await readJson(join(".", "package.json"));

  for await (const x of Object.keys(pkg.dependencies)) {
    log("Copying dependency", x);
    await copy(join(nodeModulesDir, x), join(destDir, x));
  }
};

eject();
