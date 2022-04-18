import Knex from 'knex';
import { createLogger, format, transports } from 'winston';
import Queue from 'queue-promise';
import { snakeCase } from 'lodash';

export const logger = createLogger({
    level: 'info',
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }));
}

class Database {
    #knex;
    #queue;

    constructor() {
        /* this.#knex = Knex({
            client: 'mysql',
            connection: {
                database: process.env.DATABASE_NAME,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                port: 3306,
                ssl: true,
            }
        }); */

        this.#knex = Knex({
            client: 'pg',
            connection: {
                database: process.env.LOCAL_DATABASE_NAME,
                user: 'postgres',
                password: process.env.LOCAL_DATABASE_PASSWORD,
                host: 'localhost',
                port: 5432,
            },
            wrapIdentifier: (value, origImpl ) => origImpl(snakeCase(value))
        });

        this.#queue = new Queue({
            concurrent: 1,
            interval: 200,
        });

        this.#queue.on('resolve', () => {
            logger.info({
                message: 'New promised resolved'
            });
        });

        this.#queue.on('error', (reject) => {
            logger.error({
                message: reject,
            });
        });

        (async () => {
            this.#initDatabases();
            this.#cleanTables();
        })();
    }

    async #cleanTables() {
        logger.info({
            message: 'Cleaning Databases',
        });
        try {
            await this.#knex('championsStats').delete();
            await this.#knex('matchsIds').delete();
        } catch (error) {
            throw new Error('Erron on clean championsStats table: ' + error);
        }
    }

    async #initDatabases() {
        logger.info({
            message: 'Initializing databases',
        });

        try {
            const ifChampionsStatsTableExist = await this.#knex.schema.hasTable('champions_stats');
            const ifMatchsIdsTableExists = await this.#knex.schema.hasTable('matchs_ids');

            if (!ifChampionsStatsTableExist) {
                await this.#knex.schema
                    // ...and another
                    .createTable('champions_stats', table => {
                        table.string('id').primary();
                        table.integer('champion_id');
                        table.integer('matchesPlayed');
                        table.string('champion_name');
                        table.integer('matchesWinned');
                        table.integer('matchesLossed');
                        table.string('individualPosition');
                        table.string('teamPosition');
                    });
            }

            if (!ifMatchsIdsTableExists) {
                await this.#knex.schema
                    .createTable('matchs_ids', table => {
                        table.string('id').primary();
                    });
            }
            // await connection.query('CREATE TABLE IF NOT EXISTS championsStats (id TEXT, champion_id INT, matchesPlayed INT, champion_name TEXT, matchesWinned INT, matchesLossed INT, individualPosition TEXT, teamPosition TEXT)');
        } catch (error) {
            throw new Error('Erron on create table: ' + error);
        }
    }

    getConnection() {
        return this.#knex;
    }

    enqueuePromise(prom: Promise<void>) {
        this.#queue.enqueue(async () => {
            await prom;
        });
    }
}

export default new Database();

