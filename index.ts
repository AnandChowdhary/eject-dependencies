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
  updateTestFiles?: boolean;
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
  const updatedFiles = new Set<string>();

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

  const files = (await fg(codeFiles)).filter(file =>
    settings.updateTestFiles
      ? true
      : !(file.includes(".test.") || file.includes(".spec."))
  );

  for await (const file of files) {
    let contents = await readFile(join(".", file), "utf-8");
    const pathToSource = (join(".", file).match(/\//g) || []).length;

    for (const dependency of Object.keys(pkg.dependencies)) {
      if (contents.includes(dependency)) updatedFiles.add(file);
      contents = contents.replace(
        `"${dependency}"`,
        `"${
          pathToSource > 0 ? "../".repeat(pathToSource) : "./"
        }${destDir}/${dependency}"`
      );
    }

    if (!updatedFiles.has(file)) continue;
    await writeFile(join(".", file), contents);
    log("Updated file", file);
  }

  return { updatedFiles };
};

// eject({ destDir: join(".", "path", "to", "ejected") });
