import { Request, Response, NextFunction, RequestHandler } from "express";
import { LoggerInterface } from "../utils/interfaces";
import { logger } from "./logger";
/**
 * API Request Logger
 */
export default class LoggerMiddleware {
  private logger: LoggerInterface;
  /**
   *
   * @param serviceName
   */
  constructor(public env: any) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    this.env = env;
    this.logger = logger;
  }
  private logRequest(req: Request): void {
    this.logger.info(`Called: ${req.path}`);
  }
  private logResponse(req: Request, res: Response): void {
    const { statusCode, statusMessage } = res;
    const { method, originalUrl } = req;
    const logMessage = `[${method}] ${originalUrl}: ${statusCode} ${statusMessage}`;
    if (statusCode >= 400 && statusCode < 500) {
      this.logger.warn(logMessage);
    } else if (statusCode >= 500) {
      this.logger.error(logMessage);
    } else {
      this.logger.info(logMessage);
    }
  }
  private onFinished(req: Request, res: Response): void {
    this.logResponse(req, res);
  }
  public getMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      this.logRequest(req);
      res.on("finish", () => this.onFinished(req, res));
      next();
    };
  }
}
