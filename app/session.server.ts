import {
  createCookieSessionStorage,
  createSessionStorage,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { prisma } from "./db.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createDatabaseSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

function createDatabaseSessionStorage({ cookie }) {
  const sessionStorage = createSessionStorage({
    cookie,
    async createData(data, expires) {
      console.log("creating session!!!", data);
      // `expires` is a Date after which the data should be considered
      // invalid. You could use it to invalidate the data somehow or
      // automatically purge this record from your database.
      const session = await prisma.session.create({
        data: {
          expiresAt: expires,
          userId: data.userId,
          accessToken: data.access_token,
        },
      });

      return session.id;
    },
    async readData(id) {
      return (
        (await prisma.session.findFirst({
          where: {
            id,
          },
        })) || null
      );
    },
    async updateData(id, data, expires) {
      console.log("update the session!!", id, data, expires);
      const session = await prisma.session.findFirst({
        where: {
          id,
        },
      });
      console.log("session", session);
      if (session) {
        await prisma.session.update({
          where: {
            id,
          },
          data: {
            expiresAt: expires || data.expiresAt,
            userId: data.userId,
            accessToken: data.accessToken,
          },
        });
      }
    },
    async deleteData(id) {
      await prisma.session.delete({
        where: {
          id,
        },
      });
    },
  });
  return sessionStorage;
}

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
