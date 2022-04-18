import { createLogger, transports, format } from 'winston';

class Logger {
    #logger;

    constructor() {
        this.#logger = createLogger({
            level: 'info',
        })

        if (process.env.NODE_ENV !== 'production') {
            this.#logger.add(new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.cli()
                )
            }))
        }
    }

    info(message: string) {
        this.#logger.info({
            message
        });
    }

    error(message: string) {
        this.#logger.error(new Error(message));
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