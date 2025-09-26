import { subtle } from "uncrypto";

export type { H3Event } from "h3";

const encoder = new TextEncoder();
const RATE_LIMIT_MAX_REQ = 2;
const RATE_LIMIT_TIME_FRAME = 1000 * 60 * 5;


export const hash = async (string: string, salt?: string) => {
  const data = encoder.encode(salt ? string + salt : string);
  const base64 = await subtle.digest("SHA-256", data).then(hash => Buffer.from(hash).toString("base64"));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};
