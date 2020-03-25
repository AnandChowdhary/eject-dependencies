import { eject } from "./index";

describe("node.ts", () => {
  it("works", async () => {
    expect(await eject()).toBeTruthy();
  });
});
