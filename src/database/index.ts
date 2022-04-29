import Queue from 'queue-promise';
import { logger } from '../libs';
import Prisma from '@prisma/client';

const { PrismaClient } = Prisma;
class Database {
    #queue;
    #prisma;

    constructor() {
        this.#queue = new Queue({
            concurrent: 2,
            interval: 200,
        });

        this.#queue.on('error', (reject) => {
            logger.error(reject);
        });

        this.#prisma = new PrismaClient();
    }

    getConnection() {
        return this.#prisma;
    }

    enqueuePromise(prom: Promise<unknown>) {
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

