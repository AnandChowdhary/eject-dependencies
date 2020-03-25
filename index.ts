import { join } from "path";
import {
  readJson,
  pathExists,
  ensureDir,
  copy,
  readFile,
  writeFile
} from "fs-extra";
import fg from "fast-glob";

/**
 * `console.log` messages if in development environment
 * @param params - Messages to log
 */
const log = (...params: any[]) =>
  process.env.NODE_ENV === "development" && console.log(...params);

export interface EjectSettings {
  sourceDir?: string;
  destDir?: string;
  codeFiles?: string[];
}

/**
 * Eject dependencies
 */
export const eject = async (settings: EjectSettings = {}) => {
  const nodeModulesDir = settings.sourceDir || join(".", "node_modules");
  const destDir = settings.destDir || join(".", "ejected");
  const codeFiles = settings.codeFiles || [
    "src/**/*.{js,jsx,ts,tsx,mjs,es,es6}",
    "*.{js,jsx,ts,tsx,mjs,es,es6}"
  ];

  await ensureDir(destDir);
  if (!(await pathExists(nodeModulesDir)))
    throw new Error("node_modules not found");

  const pkg: {
    dependencies: {
      [index: string]: string;
    };
  } = await readJson(join(".", "package.json"));

  for await (const dependency of Object.keys(pkg.dependencies)) {
    await copy(join(nodeModulesDir, dependency), join(destDir, dependency));
    log("Copied dependency", dependency);
  }

  const files = await fg(codeFiles);
  for await (const file of files) {
    let contents = await readFile(join(".", file), "utf-8");
    let has = false;
    Object.keys(pkg.dependencies).forEach(dependency => {
      if (contents.includes(dependency)) has = true;
    });
    if (!has) continue;
    await writeFile(join(".", file), contents);
    log("Updated file", file);
  }
};

eject();
