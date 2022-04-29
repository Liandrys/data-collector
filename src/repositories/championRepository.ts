import { ChampionStatsType } from '../types';
import Database from '../database';

class ChampionRepository {
    async getChampionById(id: string): Promise<ChampionStatsType[]> {
        const connecion = Database.getConnection();

        const response = await connecion.championStats.findMany({
            where: { id },
        });

        return response;
    }

    async createChampion(champ: ChampionStatsType, win: boolean) {
        let matchesWinned = 0;
        let matchesLossed = 0;

        if (win) {
            matchesWinned += 1;
        } else {
            matchesLossed += 1;
        }

        try {
            const connection = Database.getConnection();

            const champToSave: ChampionStatsType = {
                ... champ,
                lost_matches: matchesLossed,
                won_matches: matchesWinned,
                played_matches: 1,
            };

            const response = await connection.championStats.create({
                data: champToSave,
            });

            return response;
        } catch (error) {
            throw new Error('Error on create a champion: ' + error);
        }
    }

    async updateChampion(prevChamp: ChampionStatsType, newChamp: ChampionStatsType) {
        const connection = Database.getConnection();

        try {
            const response = await connection.championStats.update({
                where: { id: prevChamp.id },
                data: newChamp,
            });

            return response;
        } catch (error) {
            throw new Error('Error on update champion: ' + error);
        }
    }

    async getAllChampions(): Promise<ChampionStatsType[] | null> {
        const connection = Database.getConnection();

        try {
            const response = await connection.championStats.findMany();

            return response;
        } catch (error) {
            return null;
        }
    }

    async saveChampion(champion: ChampionStatsType, win: boolean): Promise<void>{
        const championOnDatabase = await this.getChampionById(champion.id);
        // The champion dosent exist on the database
        if (championOnDatabase.length === 0) {
            // There is not a chmpion on database, create a new one
            // await this.createChampion(champion, win);
            Database.enqueuePromise(this.createChampion(champion, win));
        } else {
            const newWin = championOnDatabase[0].won_matches > 0 ? championOnDatabase[0].won_matches : 0;
            const newLoss = championOnDatabase[0].lost_matches > 0 ? championOnDatabase[0].lost_matches : 0;
            const newPlayed = championOnDatabase[0].played_matches > 0 ? championOnDatabase[0].played_matches + 1 : 1;

            const newChamp: ChampionStatsType = {
                ...championOnDatabase[0],
                lost_matches: win ? newLoss : newLoss + 1,
                won_matches: win ? newWin + 1 : newWin,
                played_matches: newPlayed,
            };

            Database.enqueuePromise(this.updateChampion(championOnDatabase[0], newChamp));

        }
    }
}

export default new ChampionRepository();
