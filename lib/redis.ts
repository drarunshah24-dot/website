import { Redis } from "@upstash/redis";
import { getCloudEnv } from "./env";

let redis: Redis | null = null;

export async function getRedisClient(): Promise<Redis | null> {
  if (redis) return redis;

  const url = await getCloudEnv("UPSTASH_REDIS_REST_URL");
  const token = await getCloudEnv("UPSTASH_REDIS_REST_TOKEN");

  if (!url || !token) {
    console.warn(
      "Upstash Redis credentials not found. Falling back to stateless auth.",
    );
    return null;
  }

  redis = new Redis({
    url: url,
    token: token,
  });

  return redis;
}
