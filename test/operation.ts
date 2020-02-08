import { Test, assert, group, test } from "./helpers";
import { Endpoint, baseUrl, operations } from "../src/operation";

const tests: Test[] = group("operation/", [
  test("export", () => {
    assert(Array.isArray(operations));
    const endpoint: Endpoint | undefined = operations.find(
      ({ id }) => id === "getBookmark"
    );
    assert(typeof endpoint !== "undefined");
    assert.deepStrictEqual(baseUrl, "https://bookmark.hatenaapis.com");
    assert.deepStrictEqual(
      baseUrl + endpoint?.path,
      "https://bookmark.hatenaapis.com/rest/1/my/bookmark"
    );
  })
]);

export { tests };
