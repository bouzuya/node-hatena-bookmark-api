import { Test, assert, group, test } from "./helpers";
import { request } from "../src/request";
import nock from "nock";

const credentials = {
  accessToken: "a",
  accessTokenSecret: "b",
  consumerKey: "c",
  consumerSecret: "d"
};

const tests: Test[] = group("request/", [
  test("export", () => {
    assert(typeof request === "function");
  }),

  test("params", async () => {
    const scope = nock("https://bookmark.hatenaapis.com", {
      reqheaders: {
        "user-agent": "node-hatena-bookmark-api",
        authorization: (value: string): boolean =>
          value.startsWith("OAuth ") &&
          value.includes("oauth_nonce=") &&
          value.includes("oauth_signature=") &&
          value.includes('oauth_consumer_key="c"') &&
          value.includes('oauth_signature_method="HMAC-SHA1"') &&
          value.includes('oauth_token="a"') &&
          value.includes('oauth_version="1.0"')
      }
    })
      .get("/rest/1/my/bookmark")
      .query({ url: "http://example.com" })
      .reply(200, {
        // unused
      });

    await request("getBookmark", credentials, { url: "http://example.com" });

    scope.done();
  }),

  test("happy path", async () => {
    const scope = nock("https://bookmark.hatenaapis.com")
      .post("/rest/1/my/bookmark")
      .query(true)
      .reply(200, {});

    await request("postBookmark", credentials, { url: "http://example.com" });

    scope.done();
  }),

  test("statusCode === 204", async () => {
    const scope = nock("https://bookmark.hatenaapis.com")
      .delete("/rest/1/my/bookmark")
      .query(true)
      .reply(204, "");

    await request("deleteBookmark", credentials, { url: "http://example.com" });

    scope.done();
  }),

  test("statusCode === 403", async () => {
    const scope = nock("https://bookmark.hatenaapis.com")
      .get("/rest/1/entry")
      .query(true)
      .reply(403, {});

    await assert.rejects(() =>
      request("getEntry", credentials, { url: "http://example.com" })
    );

    scope.done();
  }),

  test("JSON.parse throws Error", async () => {
    const scope = nock("https://bookmark.hatenaapis.com")
      .get("/rest/1/my/tags")
      .query(true)
      .reply(403, "");

    await assert.rejects(() => request("getTags", credentials, {}));

    scope.done();
  }),

  test("request error", async () => {
    const scope = nock("https://bookmark.hatenaapis.com")
      .get("/rest/1/my")
      .query(true)
      .replyWithError("request error");

    await assert.rejects(() => request("getUser", credentials, {}));

    scope.done();
  }),

  test("unknown operation", async () => {
    assert.throws(() => request("unknown", credentials, {}));
  })
]);

export { tests };
