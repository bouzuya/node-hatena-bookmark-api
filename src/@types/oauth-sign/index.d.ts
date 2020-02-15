declare module "oauth-sign" {
  export function rfc3986(s: string): string;
  export function sign(
    signatureMethod: string,
    method: string,
    url: string,
    params: { [k: string]: string },
    consumerSecret: string,
    tokenSecret: string
  ): string;
}
