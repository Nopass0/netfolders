import * as express from 'express'; // Import Express using the namespace import
import { Express, Request, Response } from 'express'; // Import required types
import * as fs from 'fs';
import * as path from 'path';
import { logger, LogLevel } from './log';
import { database } from './database';

const config = require('../config.json');
const packageInfo = require('../package.json');

class FileServer {
    private app: Express;
  
    constructor() {
      this.app = express();
      this.setupMiddleware();
      this.setupRoutes();
    }
  
    private setupMiddleware() {
      this.app.use(express.json());
    }
  
    private setupRoutes() {
      if (config.secretKey) {
        this.app.use((req, res, next) => {
          const authKey = req.headers['authorization'];
          if (authKey !== config.secretKey) {
            return res.status(401).send('Unauthorized');
          }
          next();
        });
      }
  
      this.app.post('/upload/:filename', (req: Request, res: Response) => {
        const filename = req.params.filename;
        const authToken = req.headers['authorization'];
  
        if (config.secretKey && authToken !== config.secretKey) {
          return res.status(401).send('Unauthorized');
        }
  
        const token = database.addFile(filename);
        const uploadPath = path.join(__dirname, '../uploads', token);
  
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
  
        req.pipe(fs.createWriteStream(path.join(uploadPath, filename)));
  
        logger.log(`File ${filename} uploaded with token: ${token}`);
        res.send(`File ${filename} uploaded with token: ${token}`);
      });
  
      this.app.get('/get/:token', (req: Request, res: Response) => {
        const token = req.params.token;
        const filePath = `uploads/${token}/${database.getFile(token)}`;
  
        if (!filePath) {
          logger.log(`File with token ${token} not found.`, LogLevel.ERROR);
          return res.status(404).send('File not found');
        }
  
        res.download(filePath);
      });
    }
  
    public start() {
      this.app.listen(config.port, () => {
        this.displayAsciiLogo();
        logger.log(`Server started on port ${config.port}`);
      });
    }
  
    private displayAsciiLogo() {
        
        const version = `Version: ${packageInfo.version}`;
        const telegram = `Telegram: ${packageInfo.telegram}`;
        const email = `Email: ${packageInfo.email}`;
        const github = `Github: ${packageInfo.github}`;

      const logo = `
        \x1b[41m\x1b[41m\x1b[41m                   \x1b[0m
        \x1b[41m\x1b[41m\x1b[41m ███    ██ ███████ \x1b[0m    \x1b[1mNetFolders
        \x1b[41m\x1b[41m\x1b[41m ████   ██ ██      \x1b[0m    ${version}
        \x1b[41m\x1b[41m\x1b[41m ██ ██  ██ █████   \x1b[0m    ${telegram}
        \x1b[41m\x1b[41m\x1b[41m ██  ██ ██ ██      \x1b[0m    ${email}
        \x1b[41m\x1b[41m\x1b[41m ██   ████ ██      \x1b[0m    ${github}
        \x1b[41m\x1b[41m\x1b[41m                   \x1b[0m
        `;

      console.log(`${logo}`);
    }
  }
  
  export { FileServer };