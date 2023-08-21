import * as fs from 'fs'
import * as crypto from 'crypto';
import { logger, LogLevel } from './log';

const config = require('../config.json');

type FileEntry = {
  token: string;
  path: string;
  nextDeleteCheck: number;
};

class Database {
  private filePath: string;
  private data: Record<string, FileEntry>;

  constructor() {
    this.filePath = 'database.json';
    this.loadData();
    this.scheduleDeleteChecks();
  }

  private loadData() {
    try {
      const rawData = fs.readFileSync(this.filePath, 'utf8');
      this.data = JSON.parse(rawData);
    } catch (error) {
      this.data = {};
    }
  }

  private saveData() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  private scheduleDeleteChecks() {
    setInterval(() => {
      const currentTime = Date.now();
      Object.keys(this.data).forEach(token => {
        const entry = this.data[token];
        if (entry.nextDeleteCheck <= currentTime) {
          if (config.isDeleteNotUsed) {
            this.deleteFile(token);
            logger.log(`Deleted file with token: ${token}`);
          }
          delete this.data[token];
        }
      });
      this.saveData();
    }, config.checkPeriod);
  }

  private generateToken(filename: string) {
    const hash = crypto.createHash('sha256');
    hash.update(filename);
    return hash.digest('hex');
  }

  addFile(path: string): string {
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const token = this.generateToken(filename);

    if (this.data[token]) {
      logger.log(`File with token ${token} already exists.`, LogLevel.ERROR);
      return token;
    }

    const currentTime = Date.now();

    this.data[token] = {
      token,
      path,
      nextDeleteCheck: currentTime + config.checkPeriod,
    };

    this.saveData();
    logger.log(`Added file with token: ${token}`);
    return token;
  }

  deleteFile(token: string) {
    if (this.data[token]) {
      const entry = this.data[token];
      delete this.data[token];
      this.saveData();
      fs.unlinkSync(entry.path);
      logger.log(`Deleted file with token: ${token}`);
    } else {
      logger.log(`File with token ${token} not found. Deletion failed.`, LogLevel.ERROR);
    }
  }

  getFile(token: string): string | null {
    if (this.data[token]) {
      return this.data[token].path;
    } else {
      logger.log(`File with token ${token} not found.`, LogLevel.ERROR);
      return null;
    }
  }
}

export const database = new Database();
