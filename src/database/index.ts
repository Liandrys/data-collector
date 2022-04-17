import Knex from 'knex';
import { createLogger, format, transports } from 'winston';
import Queue from 'queue-promise';

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
        /* (async () => {
            this.#connection = await mysql.createConnection('mysql://rzck9h2jrmwi:pscale_pw_FNPm4sz_C7Q-KMqlMkDTkmqvvF-JFG8oe42Z50FT3K8@5201ntzru71l.us-east-2.psdb.cloud/liandry-dev?ssl={"rejectUnauthorized":true}');
            await this.#initDatabases();
        })(); */

        this.#knex = Knex({
            client: 'mysql',
            connection: {
                database: process.env.DATABASE_NAME,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                port: 3306,
                ssl: true,
            }
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
            const ifChampionsStatsTableExist = await this.#knex.schema.hasTable('championsStats');
            const ifMatchsIdsTableExists = await this.#knex.schema.hasTable('matchsIds');

            if (!ifChampionsStatsTableExist) {
                await this.#knex.schema
                    // ...and another
                    .createTable('championsStats', table => {
                        table.string('id').primary();
                        table.integer('championId');
                        table.integer('matchesPlayed');
                        table.string('championName');
                        table.integer('matchesWinned');
                        table.integer('matchesLossed');
                        table.string('individualPosition');
                        table.string('teamPosition');
                    });
            }

            if (!ifMatchsIdsTableExists) {
                await this.#knex.schema
                    .createTable('matchsIds', table => {
                        table.string('id').primary();
                    });
            }
            // await connection.query('CREATE TABLE IF NOT EXISTS championsStats (id TEXT, championId INT, matchesPlayed INT, championName TEXT, matchesWinned INT, matchesLossed INT, individualPosition TEXT, teamPosition TEXT)');
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

