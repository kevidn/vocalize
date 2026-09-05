import fs from 'fs';
import path from 'path';
import os from 'os';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';

export function getUploadDir(): string {
  // On Vercel / AWS Lambda / Serverless Functions, /var/task is read-only.
  // We MUST use os.tmpdir() (/tmp) for file writes.
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.NOW_REGION) ||
    Boolean(process.env.AWS_EXECUTION_ENV) ||
    Boolean(process.env.LAMBDA_TASK_ROOT) ||
    process.cwd().startsWith('/var/task');

  if (isServerless) {
    return os.tmpdir();
  }

  if (process.env.UPLOAD_DIR) {
    return path.resolve(process.env.UPLOAD_DIR);
  }

  return path.resolve('uploads');
}

export class StorageService {
  /**
   * Returns the absolute filesystem path for a stored file.
   * Throws 404 ApiError if the file does not exist.
   */
  getFilePath(fileName: string): string {
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, path.basename(fileName)); // prevent traversal
    if (!fs.existsSync(filePath)) {
      throw ApiError.notFound(`File "${fileName}"`);
    }
    return filePath;
  }

  /**
   * Deletes a file from the upload directory.
   * Fails silently if the file no longer exists.
   */
  async deleteFile(fileName: string): Promise<void> {
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, path.basename(fileName));
    try {
      await fs.promises.unlink(filePath);
      logger.debug(`Deleted upload: ${fileName}`);
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        logger.warn(`Could not delete file "${fileName}"`, err);
      }
    }
  }

  /**
   * Returns the size of a stored file in bytes.
   */
  async getFileSize(fileName: string): Promise<number> {
    const filePath = this.getFilePath(fileName);
    const stat = await fs.promises.stat(filePath);
    return stat.size;
  }

  /**
   * Lists all files currently in the upload directory.
   */
  async listUploads(): Promise<string[]> {
    const uploadDir = getUploadDir();
    try {
      const files = await fs.promises.readdir(uploadDir);
      return files.filter((f) => f !== '.gitkeep');
    } catch {
      return [];
    }
  }

  /**
   * Ensures the upload directory exists (creates it if missing).
   */
  ensureUploadDir(): void {
    const uploadDir = getUploadDir();
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        logger.info(`Created upload directory: ${uploadDir}`);
      }
    } catch (err: unknown) {
      logger.warn(`Notice: Upload directory "${uploadDir}" creation skipped/ignored:`, err);
    }
  }
}

export const storageService = new StorageService();
