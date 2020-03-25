import { eject } from "./index";
import { pathExists, readFile, writeFile, remove, ensureDir } from "fs-extra";

let originalCode: string;
describe("eject-dependencies", () => {
  beforeAll(async () => {
    originalCode = await readFile("./index.ts", "utf-8");
    await ensureDir("./ejected/fs-extra");
    await remove("./ejected/fs-extra");
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

  afterAll(async () => {
    await writeFile("./index.ts", originalCode);
    await ensureDir("./ejected/fs-extra");
    await remove("./ejected/fs-extra");
  });
});
