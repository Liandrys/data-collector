import { createLogger, transports, format } from 'winston';

class Logger {
    #logger;

    constructor() {
        this.#logger = createLogger({
            level: 'info',
             transports: [
                //
                // - Write all logs with importance level of `error` or less to `error.log`
                // - Write all logs with importance level of `info` or less to `combined.log`
                //
                new transports.File({ filename: 'error.log', level: 'error' }),
                new transports.File({ filename: 'warn.log', level: 'warn' }),
                new transports.File({ filename: 'combined.log' }),
            ],
        });

        if (process.env.NODE_ENV !== 'production') {
            this.#logger.add(new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.cli()
                )
            }));
        }
    }

    info(message: string) {
        this.#logger.info({
            message
        });
    }

    error(message: string) {
        this.#logger.error(message);
    }

    warn(message: string) {
        this.#logger.warn({
            message
        });
    }
}

const logger = new Logger();

export {
    logger,
};
