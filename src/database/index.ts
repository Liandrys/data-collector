import Knex from 'knex';
import Queue from 'queue-promise';
import { snakeCase } from 'lodash';
import { tablesNames } from '../sql';
import { logger } from '../libs';

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
            concurrent: 2,
            interval: 200,
        });

        this.#queue.on('resolve', () => {
            logger.info('Promise resolved');
        });

        this.#queue.on('error', (reject) => {
            logger.error(reject);
        });

        (async () => {
            this.#initDatabases();
            // this.#cleanTables();
        })();
    }

    /* async #cleanTables() {
        logger.info('Cleaning Databases');
        try {
            await this.#knex('championsStats').delete();
            await this.#knex('matchsIds').delete();
        } catch (error) {
            throw new Error('Erron on clean championsStats table: ' + error);
        }
    } */

    async #initDatabases() {
        logger.info('Initializing databases');

        try {
            const ifChampionsStatsTableExist = await this.#knex.schema.hasTable(tablesNames.championsStats);
            const ifMatchsIdsTableExists = await this.#knex.schema.hasTable(tablesNames.matches);
            const ifSummonerTableExists = await this.#knex.schema.hasTable(tablesNames.summoners);

            if (!ifSummonerTableExists) {
                await this.#knex.schema
                    .createTable(tablesNames.summoners, table => {
                        table.string('name');
                        table.integer('played_matches');
                        table.integer('won_matches');
                        table.integer('losing_matches');
                        table.smallint('level');
                        table.timestamp('last_update');
                        table.jsonb('leagues');
                        table.specificType('matches', 'TEXT[]');
                    });
            }

            if (!ifChampionsStatsTableExist) {
                await this.#knex.schema
                    .createTable(tablesNames.championsStats, table => {
                        table.string('id').primary();
                        table.integer('champion_id');
                        table.integer('played_matches');
                        table.string('champion_name');
                        table.integer('won_matches');
                        table.integer('losing_matches');
                        table.string('individual_position');
                        table.string('teamPosition');
                    });
            }

            if (!ifMatchsIdsTableExists) {
                await this.#knex.schema
                    .createTable(tablesNames.matches, table => {
                        table.string('match_id').primary();
                        table.string('game_id');
                        table.integer('game_duration');
                        table.string('game_mode');
                        table.string('game_type');
                        table.string('game_version');
                        table.jsonb('participants');
                        table.string('average_range');
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

    getPromisesQueue() {
        return this.#queue;
    }

    getPromiseQueueItsEmpty() {
        if (this.#queue.size === 0 && this.#queue.isEmpty) {
            return true;
        } else {
            return false;
        }
    }

    cleanPromiseQueue(){
        this.#queue.clear();
    }
}

export default new Database();

