import { Prisma } from '@prisma/client';
import Database from '../database';
import { SummonerType } from '../types';

class SummonerRepository {

    async saveSummoner(summoner: SummonerType) {
        const connection = Database.getConnection();

        const json = summoner.leagues as unknown as Prisma.JsonArray;

        const response = await connection.summoner.create({
            data: {
                ...summoner,
                leagues: json
            }
        });

        return response;
    }

    async getSummonerExistsByPuuid(puuid: string): Promise<boolean> {
        const connection = Database.getConnection();

        const response = await connection.summoner.count({
            where: { puuid }
        });

        if (response > 0) {
            return true;
        } else {
            return false;
        }
    }

    async updateSummoner(summoner: SummonerType) {
        const connection = Database.getConnection();
        const leagues = summoner.leagues as unknown as Prisma.JsonArray;

        const response = connection.summoner.update({
            where: {
                name: summoner.name,
            },
            data: {
                ...summoner,
                leagues
            }
        });

        return response;
    }

    async getSummonersSavedOnDB() {
        const connection = Database.getConnection();

        const response = await connection.summoner.count();

        return response;
    }

}

export default new SummonerRepository();