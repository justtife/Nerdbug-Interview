import * as dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import { config } from './config'
import { AppConfig } from ".";
const appConfig = new AppConfig(config)
function bootstrap() {
    if (process.env.APP_ENV !== "test") {
        appConfig.startServer(6541);
    }
}
bootstrap();