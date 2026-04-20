import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

const COOKIE_NAME = "dnd_uid";
const MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years

/**
 * 从 Cookie 中读取匿名用户 ID，不存在则返回 null。
 * 用于 GET / DELETE 等只读请求。
 */
export function getUserId(): string | null {
  const store = cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

/**
 * 从 Cookie 中读取匿名用户 ID，不存在则生成一个并写入 Cookie。
 * 用于 POST / PUT 等写入请求。
 */
export function getOrCreateUserId(): string {
  const store = cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = uuid();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return id;
}
