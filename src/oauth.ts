import crypto from "crypto";
import oauth from "oauth-sign";
import { URL } from "url";
import { Credentials } from "./credentials";

// Object.fromEntries
const objectFromEntries = (
  entries: IterableIterator<[string, string]>
): { [key: string]: string } => {
  const o = Object.create(null);
  for (const [k, v] of entries) {
    o[k] = v;
  }
  return o;
};

const oauthAuthorizationHeader = (
  urlString: string,
  method: string,
  oauthKeys: Credentials
): string => {
  const nonce = crypto.randomBytes(16).toString("hex");
  const signatureMethod = "HMAC-SHA1";
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const oauthSortedParams: [string, string][] = [
    ["oauth_consumer_key", oauthKeys.consumerKey],
    ["oauth_nonce", nonce],
    ["oauth_signature_method", signatureMethod],
    ["oauth_timestamp", timestamp],
    ["oauth_token", oauthKeys.accessToken],
    ["oauth_version", "1.0"],
  ];

  const urlObject = new URL(urlString);
  for (const [name, value] of oauthSortedParams) {
    urlObject.searchParams.append(name, value);
  }

  const params = [
    ...oauthSortedParams,
    [
      "oauth_signature",
      oauth.sign(
        signatureMethod,
        method,
        urlObject.protocol + "//" + urlObject.host + urlObject.pathname,
        objectFromEntries(urlObject.searchParams.entries()),
        oauthKeys.consumerSecret,
        oauthKeys.accessTokenSecret
      ),
    ],
  ]
    .map(([name, value]) => `${name}="${oauth.rfc3986(value)}"`)
    .join(",");
  return `OAuth ${params}`;
};

export { oauthAuthorizationHeader };
