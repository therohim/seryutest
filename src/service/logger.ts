import { createLogger, format, transports, addColors } from 'winston';
import 'winston-daily-rotate-file';
import config from '../config/config';

const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const colors = { error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'blue' };

addColors(colors);

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

let optionTransports: any[] = [];
optionTransports.push(
    new transports.Console({
        format: format.combine(
            format.colorize({ all: true }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.colorize(),
            format.printf(({ timestamp, level, message, meta }) => `${timestamp} [${level}]: ${message}, ${JSON.stringify({ meta })}`)
        )
    })
);

if (config.env == 'dev') {
    optionTransports.push(
        new transports.DailyRotateFile({
            datePattern: 'YYYYMMDD',
            filename: `./logs/log-%DATE%.log`,
            dirname: 'logs',
            zippedArchive: true
        })
    );
    optionTransports.push(
        new transports.DailyRotateFile({
            level: 'error',
            datePattern: 'YYYYMMDD',
            filename: `./logs/error-%DATE%.log`,
            dirname: 'logs',
            zippedArchive: true
        })
    );
}

const logger = createLogger({
    level: level(),
    levels,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, meta }) => `[${timestamp}] [${level}]: ${message}, Additional Info: ${JSON.stringify(meta) || null}`)
    ),
    transports: optionTransports
});

export default logger;
