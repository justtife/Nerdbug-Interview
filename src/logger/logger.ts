import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, metadata, colorize } = format;
import path from "path";
import { config } from "../config";

// Logger output Format for file(error messages)
const logFormat = () =>
    printf(({ level, label, timestamp, message, ...meta }) => {
        return `[${level}] ${timestamp} ${label} [${config.SERVICE}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""
            }`;
    });
const consoleFormat = () =>
    printf(({ level, label, timestamp, message }) => {
        return `[${level}] ${timestamp} ${label} [${config.SERVICE}]: ${message}`;
    });
const logTransports = [];
const consoleLog = new transports.Console({
    format: combine(
        colorize({ all: false, level: true }),
        consoleFormat(),
    ),
});
const fileLog = new transports.File({
    level: "error" || "warn",
    filename: path.join(__dirname, `../logs/${config.SERVICE}-logger.log`),
    format: logFormat(),
});
switch (config.APP_ENV) {
    case "production":
        logTransports.push(consoleLog);
        break;
    case "test":
        logTransports.push(consoleLog);
        break;
    default:
        logTransports.push(fileLog, consoleLog);
        break;
}
const logger = createLogger({
    transports: logTransports,
    format: combine(
        label({ label: "Interview-Logger" }),
        timestamp({ format: "YY-MM-DD HH:mm:ss" }),
        metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
        logFormat(),
    ),
});

export { logger };
