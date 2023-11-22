import express, {
  Request,
  Response,
  NextFunction,
  Application,
} from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit, { Options } from "express-rate-limit";
import compression from "compression";
import passport from "passport"
import cookieParser from "cookie-parser";
import session, { Store } from "express-session";
const MySQLStore = require("express-mysql-session")(session);
import { config, SessionDBOptions } from "./config";
import { UserRoute } from "./routes";
// import swaggerUI from "swagger-ui-express";
import {
  ErrorHandlerMiddleware,
  NotFoundMiddleware,
} from "./middlewares";
import {
  ResponseHandler,
  DBConnection,
  StatusCode, PassportConfig
} from "./utils";
import { ReqLog, Logger } from "./logger";
/**
 * Application Config Files
 */
class App {
  private app: Application;
  constructor(
    private env: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    this.env = env;
    this.app = express();
    this.config();
    this.routes();
    this.appMiddlewares();
  }
  private config(): void {
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: false,
      }),
    );
    this.app.disable("x-powered-by");
    this.app.use(helmet());
    this.app.use(helmet.noSniff());
    this.app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      }),
    );
    this.app.set("trust proxy", this.env.APP_ENV === "production");
    this.app.use(cors({}));
    this.app.use(
      rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 5,
        skipSuccessfulRequests: true,
        handler: function (
          req: Request,
          res: Response,
          next: NextFunction,
          options: Options,
        ) {
          ResponseHandler.error(res, {
            message: options.message,
            statusCode: StatusCode.TOO_MANY_REQUEST,
          });
        },
      }),
    );
    const sessionStore = new MySQLStore(SessionDBOptions);
    this.app.use(cookieParser(config.JWT_SECRET as string));
    this.app.use(
      session({
        name: config.SERVICE as string,
        secret: config.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        store: sessionStore as Store,
        cookie: {
          maxAge: 3 * 60 * 60 * 1000,
          signed: true,
          httpOnly: true,
          secure: process.env.APP_ENV === "production",
        }
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    PassportConfig(passport);
    this.app.use(compression());
    const apiLogMiddleware = new ReqLog(this.env.SERVICE).getMiddleware();
    this.app.use(apiLogMiddleware);
  }
  private routes(): void {
    this.app.use("/api/v1/users", UserRoute)
  }
  getApp(): Application {
    return this.app;
  }
  private appMiddlewares(): void {
    this.app.use(NotFoundMiddleware);
    this.app.use(ErrorHandlerMiddleware);
  }

  public async startServer(app_port: number): Promise<void> {
    await DBConnection.createDatabaseConnection();
    this.app
      .listen(app_port, () => {
        Logger.info(
          `Server listening on port ${app_port} and running in ${this.env.APP_ENV as string
          } mode...`,
        );
      })
      .on("error", (error: Error) => {
        Logger.error(`Error starting server: ${error.message}`);
        process.exit(1);
      });
    const signal = "SIGINT" || "SIGTERM" || "SIGQUIT";
    process.on(signal, async () => {
      await DBConnection.closeDatabaseConnection();
      process.exit(0);
    });
  }
}
export {
  App as AppConfig,
};
