export async function getCloudEnv(key: string): Promise<string | undefined> {
  return process.env[key];
}
