import originalRequest from "request";
import { promisify } from "util";
import { Credentials } from "./credentials";
import { baseUrl, operations } from "./operation";

const request = <T extends object, U>(
  operationId: string,
  oauth: Credentials,
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
    oauth: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      consumer_key: oauth.consumerKey,
      // eslint-disable-next-line @typescript-eslint/camelcase
      consumer_secret: oauth.consumerSecret,
      token: oauth.accessToken,
      // eslint-disable-next-line @typescript-eslint/camelcase
      token_secret: oauth.accessTokenSecret
    },
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

export { request };
