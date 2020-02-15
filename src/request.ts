import fetch, { Headers, Response } from "node-fetch";
import { URL } from "url";
import { Credentials } from "./credentials";
import { oauthAuthorizationHeader } from "./oauth";
import { baseUrl, operations } from "./operation";

const request = <T extends object, U>(
  operationId: string,
  oauth: Credentials,
  params: T
): Promise<U> => {
  const operation = operations.find(({ id }) => id === operationId);
  if (typeof operation === "undefined")
    throw new Error(`unknown operation id: ${operationId}`);
  // TODO: check parameters
  const headers = new Headers({
    "User-Agent": "node-hatena-bookmark-api"
  });
  const method = operation.method;
  const urlObject = new URL(operation.path, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    urlObject.searchParams.append(key, value);
  });
  headers.append(
    "Authorization",
    oauthAuthorizationHeader(urlObject.toString(), method, oauth)
  );
  return fetch(urlObject.toString(), { headers, method }).then(
    (response: Response) => {
      if (response.status === 204) return Promise.resolve();
      else if (200 <= response.status && response.status <= 299)
        return response.json();
      else {
        // if (response.statusCode === 403) {
        //   const scopes = operation.authorization.join(' or ');
        //   throw new Error(`OAuth Authorization (${scopes}) is required.`);
        // }
        const { headers, status } = response;
        return response.json().then(
          body => {
            return Promise.reject({
              body, // type...
              headers,
              statusCode: status
            });
          },
          _ => {
            // no response body
            // JSON.parse error ?
            return Promise.reject({
              body: null, // type...
              headers,
              statusCode: status
            });
          }
        );
      }
    },
    (error: Error) => {
      // connection error ?
      return Promise.reject({
        body: error, // type...
        headers: {},
        statusCode: 0
      });
    }
  );
};

export { request };
