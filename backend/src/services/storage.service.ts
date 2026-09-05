import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';

const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR ?? (process.env.VERCEL ? '/tmp' : 'uploads'),
);

export class StorageService {
  /**
   * Returns the absolute filesystem path for a stored file.
   * Throws 404 ApiError if the file does not exist.
   */
  getFilePath(fileName: string): string {
    const filePath = path.join(UPLOAD_DIR, path.basename(fileName)); // prevent traversal
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
    const filePath = path.join(UPLOAD_DIR, path.basename(fileName));
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
    const files = await fs.promises.readdir(UPLOAD_DIR);
    return files.filter((f) => f !== '.gitkeep');
  }

  /**
   * Ensures the upload directory exists (creates it if missing).
   */
  ensureUploadDir(): void {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      logger.info(`Created upload directory: ${UPLOAD_DIR}`);
    }
  }
}

export const storageService = new StorageService();
