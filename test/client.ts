import { Test, assert, group, test } from "./helpers";
import { Client } from "../src/client";
import * as requestModule from "../src/request";

const credentials = {
  accessToken: "access-token",
  accessTokenSecret: "access-token-secret",
  consumerKey: "consumer-key",
  consumerSecret: "consumer-secret",
};

const tests: Test[] = group("client/", [
  test("getBookmark", async ({ sandbox }) => {
    const request = sandbox.stub(requestModule, "request");
    request.returns(
      Promise.resolve({
        favorites: [
          {
            comment: "comment",
            // eslint-disable-next-line @typescript-eslint/camelcase
            comment_raw: "comment_raw",
            // eslint-disable-next-line @typescript-eslint/camelcase
            created_datetime: "created_datetime",
            // eslint-disable-next-line @typescript-eslint/camelcase
            created_epoch: 123456,
            eid: "eid",
            permalink: "http://example.com",
            private: true,
            tags: ["tag1", "tag2"],
            user: "bouzuya",
          },
        ],
      })
    );
    const client = new Client(credentials);
    const params = { url: "http://example.com" };
    await client.getBookmark(params);
    assert(request.callCount === 1);
    assert.deepStrictEqual(request.getCall(0).args, [
      "getBookmark",
      credentials,
      params,
    ]);
  }),

  test("postBookmark", async ({ sandbox }) => {
    const request = sandbox.stub(requestModule, "request");
    request.returns(
      Promise.resolve({
        comment: "comment",
        // eslint-disable-next-line @typescript-eslint/camelcase
        comment_raw: "comment_raw",
        // eslint-disable-next-line @typescript-eslint/camelcase
        created_datetime: "created_datetime",
        // eslint-disable-next-line @typescript-eslint/camelcase
        created_epoch: 123456,
        eid: "eid",
        permalink: "http://example.com",
        private: true,
        tags: ["tag1", "tag2"],
        user: "bouzuya",
      })
    );
    const client = new Client(credentials);
    const params = {
      comment: "comment",
      // eslint-disable-next-line @typescript-eslint/camelcase
      post_evernote: false,
      // eslint-disable-next-line @typescript-eslint/camelcase
      post_facebook: false,
      // eslint-disable-next-line @typescript-eslint/camelcase
      post_mixi: false,
      // eslint-disable-next-line @typescript-eslint/camelcase
      post_twitter: false,
      private: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      send_mail: false,
      tags: ["tag1", "tag2"],
      url: "http://example.com",
    };
    await client.postBookmark(params);
    assert(request.callCount === 1);
    assert.deepStrictEqual(request.getCall(0).args, [
      "postBookmark",
      credentials,
      params,
    ]);
  }),

  test("deleteBookmark", async ({ sandbox }) => {
    const request = sandbox.stub(requestModule, "request");
    request.returns(Promise.resolve());
    const client = new Client(credentials);
    const params = {
      url: "http://example.com",
    };
    await client.deleteBookmark(params);
    assert(request.callCount === 1);
    assert.deepStrictEqual(request.getCall(0).args, [
      "deleteBookmark",
      credentials,
      params,
    ]);
  }),

  test("getEntry", async ({ sandbox }) => {
    const request = sandbox.stub(requestModule, "request");
    request.returns(
      Promise.resolve({
        count: 1,
        eid: "eid",
        // eslint-disable-next-line @typescript-eslint/camelcase
        entry_url: "http://example.com",
        // eslint-disable-next-line @typescript-eslint/camelcase
        favicon_url: "http://example.com/favicon.png",
        // eslint-disable-next-line @typescript-eslint/camelcase
        has_asin: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        is_invalid_url: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        root_url: "http://example.com",
        // eslint-disable-next-line @typescript-eslint/camelcase
        smartphone_app_entry_url: "http://example.com",
        title: "title",
        // eslint-disable-next-line @typescript-eslint/camelcase
        title_last_editor: "bouzuya",
        url: "http://example.com",
      })
    );
    const client = new Client(credentials);
    const params = {
      url: "http://example.com",
    };
    await client.getEntry(params);
    assert(request.callCount === 1);
    assert.deepStrictEqual(request.getCall(0).args, [
      "getEntry",
      credentials,
      params,
    ]);
  }),

  test("getTags", async ({ sandbox }) => {
    const request = sandbox.stub(requestModule, "request");
    request.returns(
      Promise.resolve([
        {
          count: 1,
          tag: "tag1",
        },
      ])
    );
    const client = new Client(credentials);
    const params = {};
    await client.getTags(params);
    assert(request.callCount === 1);
    assert.deepStrictEqual(request.getCall(0).args, [
      "getTags",
      credentials,
      params,
    ]);
  }),

  test("getUser", async ({ sandbox }) => {
    const request = sandbox.stub(requestModule, "request");
    request.returns(
      Promise.resolve({
        // eslint-disable-next-line @typescript-eslint/camelcase
        is_oauth_evernote: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        is_oauth_facebook: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        is_oauth_mixi_check: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        is_oauth_twitter: false,
        name: "bouzuya",
        plususer: false,
        private: false,
      })
    );
    const client = new Client(credentials);
    const params = {};
    await client.getUser(params);
    assert(request.callCount === 1);
    assert.deepStrictEqual(request.getCall(0).args, [
      "getUser",
      credentials,
      params,
    ]);
  }),
]);

export { tests };
