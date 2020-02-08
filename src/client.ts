import originalRequest from "request";
import { promisify } from "util";
import { baseUrl, operations } from "./operation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequestOAuth = any;

const request = <T extends object, U>(
  operationId: string,
  oauth: RequestOAuth,
  params: T
): Promise<U> => {
  const operation = operations.find(({ id }) => id === operationId);
  if (typeof operation === "undefined")
    throw new Error(`unknown operation id: ${operationId}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promisedRequest = promisify(originalRequest as any);
  // TODO: check parameters
  return promisedRequest({
    headers: {
      "User-Agent": "node-hatena-bookmark-api"
    },
    method: operation.method,
    oauth,
    qs: params,
    qsStringifyOptions: { arrayFormat: "repeat" },
    url: baseUrl + operation.path
  }).then(
    (response: originalRequest.Response) => {
      if (response.statusCode === 204) return Promise.resolve();
      else if (200 <= response.statusCode && response.statusCode <= 299)
        return Promise.resolve(JSON.parse(response.body));
      else {
        // if (response.statusCode === 403) {
        //   const scopes = operation.authorization.join(' or ');
        //   throw new Error(`OAuth Authorization (${scopes}) is required.`);
        // }
        const { body, headers, statusCode } = response;
        try {
          return Promise.reject({
            body: JSON.parse(body),
            headers,
            statusCode
          });
        } catch (_) {
          // JSON.parse error ?
          return Promise.reject({ body, headers, statusCode });
        }
      }
    },
    (error: Error) => {
      // connection error ?
      return Promise.reject({ body: error, headers: {}, statusCode: 0 });
    }
  );
};

interface Credentials {
  accessToken: string;
  accessTokenSecret: string;
  consumerKey: string;
  consumerSecret: string;
}

interface Bookmark {
  comment: string;
  comment_raw: string;
  created_datetime: string;
  created_epoch: number;
  eid: string;
  permalink: string;
  private: boolean;
  tags: string[];
  user: string;
}

interface BookmarkWithFavorites extends Bookmark {
  favorites: Bookmark[];
}

class Client {
  private credentials: Credentials;

  constructor(credentials: Credentials) {
    this.credentials = credentials;
  }

  public getBookmark({ url }: { url: string }): Promise<BookmarkWithFavorites> {
    return request("getBookmark", this.oauth(), { url });
  }

  public postBookmark(params: {
    comment?: string;
    post_evernote?: boolean;
    post_facebook?: boolean;
    post_mixi?: boolean;
    post_twitter?: boolean;
    private?: boolean;
    send_mail?: boolean;
    tags?: string[];
    url: string;
  }): Promise<Bookmark> {
    return request("postBookmark", this.oauth(), params);
  }

  public deleteBookmark({ url }: { url: string }): Promise<void> {
    return request("deleteBookmark", this.oauth(), { url });
  }

  public getEntry({ url }: { url: string }): Promise<Entry> {
    return request("getEntry", this.oauth(), { url });
  }

  public getTags(_params: {}): Promise<Tag[]> {
    return request<{}, { tags: Tag[] }>("getTags", this.oauth(), {}).then(
      ({ tags }) => tags
    );
  }

  public getUser(_params: {}): Promise<User> {
    return request("getUser", this.oauth(), {});
  }

  private oauth(): RequestOAuth {
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      consumer_key: this.credentials.consumerKey,
      // eslint-disable-next-line @typescript-eslint/camelcase
      consumer_secret: this.credentials.consumerSecret,
      token: this.credentials.accessToken,
      // eslint-disable-next-line @typescript-eslint/camelcase
      token_secret: this.credentials.accessTokenSecret
    };
  }
}

interface Entry {
  count: number;
  eid: string;
  entry_url: string;
  favicon_url: string;
  has_asin: boolean;
  is_invalid_url: boolean;
  root_url: string;
  smartphone_app_entry_url: string;
  title: string;
  title_last_editor: string;
  url: string;
}

interface Tag {
  count: number;
  tag: string;
}

interface User {
  is_oauth_evernote: boolean;
  is_oauth_facebook: boolean;
  is_oauth_mixi_check: boolean;
  is_oauth_twitter: boolean;
  name: string;
  plususer: boolean;
  private: boolean;
}

export { Bookmark, BookmarkWithFavorites, Client, Entry, Tag, User };
