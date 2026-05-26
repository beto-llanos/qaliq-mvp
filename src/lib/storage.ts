import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Storage adapter — file-backed.
 *
 * In dev: writes to ./storage (gitignored).
 * In Railway: STORAGE_PATH should be the mounted volume path (e.g. /data/storage).
 *
 * The adapter interface is intentionally minimal so swapping to S3/R2
 * later is a one-file change.
 */

const ROOT = process.env.STORAGE_PATH ?? "./storage";

export interface StoredObject {
  storageKey: string;
  sizeBytes: number;
  checksum: string;
}

/** Save a buffer under `org_<id>/<filename>` and return its metadata. */
export async function putObject(
  organizationId: string,
  filename: string,
  data: Buffer
): Promise<StoredObject> {
  const orgDir = path.join(ROOT, `org_${organizationId}`);
  await fs.mkdir(orgDir, { recursive: true });

  const checksum = crypto.createHash("sha256").update(data).digest("hex");
  const storageKey = path.posix.join(`org_${organizationId}`, filename);
  const absPath = path.join(ROOT, storageKey);

  await fs.writeFile(absPath, data);

  return {
    storageKey,
    sizeBytes: data.byteLength,
    checksum,
  };
}

export async function getObject(storageKey: string): Promise<Buffer> {
  const absPath = path.join(ROOT, storageKey);
  return fs.readFile(absPath);
}

export async function deleteObject(storageKey: string): Promise<void> {
  const absPath = path.join(ROOT, storageKey);
  await fs.unlink(absPath).catch(() => undefined);
}
