import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

export const useDB = () => prismaClient;

export const now = () => BigInt(Date.now());

export const toBigInt = (value?: number | bigint | null) => {
  if (value === null || value === undefined) {
    return null;
  }
  return typeof value === "bigint" ? value : BigInt(value);
};

export const normalizeBigInt = <T>(input: T): T => {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === "bigint") {
    return Number(input) as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => normalizeBigInt(item)) as T;
  }

  if (typeof input === "object") {
    const entries = Object.entries(input as Record<string, unknown>).map(([key, value]) => [
      key,
      normalizeBigInt(value),
    ]);
    return Object.fromEntries(entries) as T;
  }

  return input;
};

export const createConnection = async (userId: number, provider: string, providerId: string) => {
  const DB = useDB();
  const today = now();

  await DB.socialConnection.upsert({
    where: {
      provider_providerId: {
        provider,
        providerId: providerId.toString(),
      },
    },
    update: {
      userId,
      updatedAt: today,
    },
    create: {
      userId,
      provider,
      providerId: providerId.toString(),
      createdAt: today,
      updatedAt: today,
    },
  });

  return { provider, providerId, userId };
};
