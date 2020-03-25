import { eject } from "./index";
import { pathExists, readFile, writeFile, remove, ensureDir } from "fs-extra";

let originalIndexTS: string;
let originalIndexSpecTS: string;

describe("eject-dependencies", () => {
  beforeAll(async () => {
    originalIndexTS = await readFile("./index.ts", "utf8");
    originalIndexSpecTS = await readFile("./index.spec.ts", "utf8");
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

  it("updates specfile", async () => {
    await eject({ updateTestFiles: true });
    const indexSpecFile = await readFile("./index.spec.ts", "utf8");
    expect(indexSpecFile.includes(`from "./ejected`)).toBeTruthy();
  });

  it("updates nested file", async () => {
    await ensureDir("./n/e/s/t/e");
    await writeFile("./n/e/s/t/e/d.ts", `import { readFile } from "fs-extra"`);
    await eject({ codeFiles: ["n/e/s/**/*.ts"] });
    const destDirFile = await readFile("./n/e/s/t/e/d.ts", "utf8");
    console.log(destDirFile);
    expect(destDirFile.includes(`from "../../../`)).toBeTruthy();
  });

  it("updates with dependencies filter", async () => {
    await writeFile(
      "./filter.ts",
      `import { readFile } from "fs-extra";
      import fg from "fast-glob";`
    );
    await eject({
      codeFiles: ["./filter.ts"],
      dependenciesFilter: files => {
        files.delete("fast-glob");
        return files;
      }
    });
    const filterFile = await readFile("./filter.ts", "utf8");
    console.log(filterFile);
    expect(
      filterFile.includes(`import { readFile } from "./ejected/fs-extra"`)
    ).toBeTruthy();
    expect(filterFile.includes(`import fg from "fast-glob"`)).toBeTruthy();
  });

  afterAll(async () => {
    await writeFile("./index.ts", originalIndexTS);
    await writeFile("./index.spec.ts", originalIndexSpecTS);
    await ensureDir("./ejected");
    await remove("./ejected");
    await remove("./path/to/ejected");
    await remove("./no-dependencies.js");
    await remove("./dest-dir.ts");
    await remove("./n");
    await remove("./filter.ts");
  });
});
