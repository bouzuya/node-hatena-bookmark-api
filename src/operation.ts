interface Endpoint {
  authorization: string[];
  id: string;
  method: string;
  parameters: string[];
  path: string;
}

const baseUrl = "http://api.b.hatena.ne.jp";

const operations: Endpoint[] = [
  // Bookmark API
  {
    authorization: ["read_public", "read_private"],
    id: "getBookmark",
    method: "GET",
    parameters: ["url"],
    path: "/1/my/bookmark"
  },
  {
    authorization: ["write_public", "write_private"],
    id: "postBookmark",
    method: "POST",
    parameters: [
      "comment",
      "post_evernote",
      "post_facebook",
      "post_mixi",
      "post_twitter",
      "private",
      "send_mail",
      "tags",
      "url"
    ],
    path: "/1/my/bookmark"
  },
  {
    authorization: ["write_public", "write_private"],
    id: "deleteBookmark",
    method: "DELETE",
    parameters: ["url"],
    path: "/1/my/bookmark"
  },
  // Entry API
  {
    authorization: ["read_private"],
    id: "getEntry",
    method: "GET",
    parameters: ["url"],
    path: "/1/entry"
  },
  // Tag API
  {
    authorization: ["read_private"],
    id: "getTags",
    method: "GET",
    parameters: [],
    path: "/1/my/tags"
  },
  // User information API
  {
    authorization: ["read_private"],
    id: "getUser",
    method: "GET",
    parameters: [],
    path: "/1/my"
  }
];

export { Endpoint, baseUrl, operations };
