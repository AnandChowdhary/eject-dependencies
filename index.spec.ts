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

  afterAll(async () => {
    await writeFile("./index.ts", originalCode);
  });
});
