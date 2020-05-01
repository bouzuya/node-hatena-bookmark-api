import { Test, assert, group, test } from "./helpers";
import { Credentials } from "../src/credentials";

const tests: Test[] = group("credentials/", [
  test("export", async () => {
    const credentials: Credentials = {
      accessToken: "a",
      accessTokenSecret: "b",
      consumerKey: "c",
      consumerSecret: "d",
    };
    assert(typeof credentials === "object");
  }),
]);

export { tests };
