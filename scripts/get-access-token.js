/* eslint-disable */
// OAuth 1.0a
// consumer_key + consumer_secret -> access_token + access_token_secret

const http = require("http");
const querystring = require("querystring");
const originalRequest = require("request");
const { URL } = require("url");

const request = options =>
  new Promise((resolve, reject) =>
    originalRequest(
      options,
      (error, result) => void (error ? reject(error) : resolve(result))
    )
  );

const main = async () => {
  const consumerKey = process.env.CONSUMER_KEY;
  if (typeof consumerKey === "undefined") throw new Error("CONSUMER_KEY");
  const consumerSecret = process.env.CONSUMER_SECRET;
  if (typeof consumerSecret === "undefined") throw new Error("CONSUMER_SECRET");

  const requestTokenUrl = "https://www.hatena.com/oauth/initiate";
  const requestTokenResponse = await request({
    method: "POST",
    oauth: {
      callback: "http://localhost:4567/oauth_callback",
      consumer_key: consumerKey,
      consumer_secret: consumerSecret
    },
    qs: { scope: "read_public,read_private,write_public,write_private" },
    url: requestTokenUrl
  });

  // oauth_token & oauth_token_secret & oauth_callback_confirmed
  const requestToken = querystring.parse(requestTokenResponse.body);
  const authorizeUrl = "https://www.hatena.ne.jp/oauth/authorize";

  const authorizeUrlBuilder = new URL(authorizeUrl);
  authorizeUrlBuilder.searchParams.set("oauth_token", requestToken.oauth_token);
  const authorizeUrlWithRequestToken = authorizeUrlBuilder.toString();
  console.log(authorizeUrlWithRequestToken);

  const { oauthToken, oauthVerifier } = await new Promise(resolve => {
    const server = new http.Server();
    server.on("request", (request, response) => {
      response.end("OK. See console.");
      const redirectUrl = new URL(
        request.url,
        `http://${request.headers.host}`
      );
      const token = {
        oauthToken: redirectUrl.searchParams.get("oauth_token"),
        oauthVerifier: redirectUrl.searchParams.get("oauth_verifier")
      };
      server.close(_ => resolve(token));
    });
    server.listen(4567, () =>
      console.log("listening for callback: localhost:4567")
    );
  });

  if (oauthToken !== requestToken.oauth_token)
    throw new Error("oauth_token error");

  const accessTokenUrl = "https://www.hatena.com/oauth/token";
  const accessTokenResponse = await request({
    method: "POST",
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      token: requestToken.oauth_token,
      token_secret: requestToken.oauth_token_secret,
      verifier: oauthVerifier
    },
    url: accessTokenUrl
  });
  const accessToken = querystring.parse(accessTokenResponse.body);
  console.log("access_token:");
  console.log(accessToken.oauth_token);
  console.log("access_token_secret:");
  console.log(accessToken.oauth_token_secret);
};

main();
