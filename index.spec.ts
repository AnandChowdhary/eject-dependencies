import { eject } from "./index";
import { pathExists, readFile, writeFile, remove, ensureDir } from "fs-extra";

let originalCode: string;
describe("eject-dependencies", () => {
  beforeAll(async () => {
    originalCode = await readFile("./index.ts", "utf8");
    await ensureDir("./ejected");
    await remove("./ejected");
  });

  it("copies a dependency", async () => {
    await eject();
    expect(await pathExists("./ejected/fs-extra")).toBeTruthy();
  });

  it("throws if node_modules is not found", () => {
    eject({ sourceDir: "/404" })
      .then(() => {})
      .catch(error => expect(error).toBeDefined());
  });

  it("returns updated files", async () => {
    const result = await eject();
    expect(result.updatedFiles).toEqual(new Set().add("index.ts"));
  });

  it("returns updated dependencies", async () => {
    const result = await eject();
    expect(result.updatedDependencies).toEqual(
      new Set().add("fast-glob").add("fs-extra")
    );
  });

  it("does not update file without dependencies", async () => {
    await writeFile("./no-dependencies.js", "//");
    const result = await eject();
    expect(result.updatedDependencies.has("no-dependencies.js")).toBeFalsy();
  });

  it("updates with dest dir", async () => {
    await writeFile("./dest-dir.ts", `import { readFile } from "fs-extra"`);
    await eject({ destDir: "path/to/ejected" });
    const destDirFile = await readFile("./dest-dir.ts", "utf8");
    expect(destDirFile.includes(`from "./path/to/ejected`)).toBeTruthy();
  });

  afterAll(async () => {
    await writeFile("./index.ts", originalCode);
    await ensureDir("./ejected");
    await remove("./ejected");
    await remove("./path/to/ejected");
    await remove("./no-dependencies.js");
    await remove("./dest-dir.ts");
  });
});
