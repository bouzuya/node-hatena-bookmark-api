import { Test, assert, group, test } from "./helpers";
import { request } from "../src/request";

const tests: Test[] = group("request/", [
  test("export", () => {
    assert(typeof request === 'function');
  }),

  test("TODO", () => {
    // TODO
  })
]);

export { tests };
