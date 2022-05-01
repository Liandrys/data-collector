import { Prisma } from '@prisma/client';
import Database from '../database';
import { SummonerType } from '../types';

class SummonerRepository {

    /**
     * Save a summoner on the database
     * @param summoner The summoner to save
     * @returns the summoner saved
     */
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

    /**
     * Save a summoner on the database
     * @param puuid The puuid of the summoner
     * @returns From the database the summoner with the puuid
     */
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

    /**
     * Update a summoner on the database
     * @param summoner The summoner object to update
     * @returns the summoner updated
     */
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

    /**
     * Count all summoners saved on the database
     * @returns The number of summoners saved on the database
     */
    async getSummonersSavedOnDB() {
        const connection = Database.getConnection();

        const response = await connection.summoner.count();

        return response;
    }

}

export default new SummonerRepository();