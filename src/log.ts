import * as fs from 'fs'
const config = require('../config.json');

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

class Logger {
  private logFilePath: string;
  private logStream: fs.WriteStream | null;

  constructor() {
    this.logFilePath = `logs/${this.getFormattedDateWithoutTime()}.log`;
    this.logStream = null;

    if (config.saveLogs) {
      fs.mkdirSync('logs', { recursive: true });
      this.logStream = fs.createWriteStream(this.logFilePath, { flags: 'a' });
    }
  }

  private getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  private getFormattedDateWithoutTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private writeToLog(message: string) {
    if (this.logStream) {
      this.logStream.write(`[${this.getFormattedDate()}]: ${message}\n`);
    }
  }

  private logColored(message: string, colorCode: string) {
    console.log(`${colorCode}[${this.getFormattedDate()}]: ${message}\x1b[0m`);
    this.writeToLog(message);
  }

  log(message: string, level: LogLevel = LogLevel.INFO) {
    switch (level) {
      case LogLevel.INFO:
        this.logColored(message, '\x1b[36m'); // Cyan color
        break;
      case LogLevel.WARN:
        this.logColored(message, '\x1b[33m'); // Yellow color
        break;
      case LogLevel.ERROR:
        this.logColored(message, '\x1b[31m'); // Red color
        break;
      default:
        this.logColored(message, '\x1b[0m'); // Default color
    }
  }

  logProgress(current: number, total: number, message: string) {
    const progress = Math.min((current / total) * 100, 100);
    const progressBar = `[${'#'.repeat(progress)}${'.'.repeat(100 - progress)}]`;
    this.log(`${message} ${progressBar} ${progress.toFixed(2)}%`);
  }
}

export const logger = new Logger();
