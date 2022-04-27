import { ChampionStatsType } from '../types';
import Database from '../database';
import { logger } from '../libs';
import { tablesNames } from '../sql';

class ChampionRepository {
    async getChampionById(id: string): Promise<ChampionStatsType[]> {
        const connecion = Database.getConnection();

        return connecion<ChampionStatsType>(tablesNames.championsStats).select().where('id', id)
            .then(result => {
                return result;
            });

    }

    async createChampion(champ: ChampionStatsType, win: boolean) {
        const id =  champ.id;
        let matchesWinned = 0;
        let matchesLossed = 0;

        if (win) {
            matchesWinned += 1;
        } else {
            matchesLossed += 1;
        }

        try {
            const connection = Database.getConnection();

            const champToSave = {
                id,
                champion_id: champ.champion_id,
                champion_name: champ.champion_name,
                individual_position: champ.individual_position,
                losing_matches: matchesLossed,
                won_matches: matchesWinned,
                played_matches: 1,
                team_position: champ.team_position,
                tier: champ.tier,
            };

            await connection<ChampionStatsType>(tablesNames.championsStats).insert(champToSave).then( () =>{
                logger.info(`Champion with id ${champToSave.id} saved on the database`);
            });
        } catch (error) {
            throw new Error('Error on create a champion: ' + error);
        }
    }

    async updateChampion(prevChamp: ChampionStatsType, newChamp: ChampionStatsType) {
        const connection = Database.getConnection();

        try {
            await connection<ChampionStatsType>(tablesNames.championsStats).where('id', prevChamp.id).update(newChamp);
        } catch (error) {
            throw new Error('Error on update champion: ' + error);
        }
    }

    async getAllChampions(): Promise<ChampionStatsType[] | null> {
        const connection = Database.getConnection();

        try {
            return await connection<ChampionStatsType>(tablesNames.championsStats).select();
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
            const newLoss = championOnDatabase[0].losing_matches > 0 ? championOnDatabase[0].losing_matches : 0;
            const newPlayed = championOnDatabase[0].played_matches > 0 ? championOnDatabase[0].played_matches + 1 : 1;

            const newChamp: ChampionStatsType = {
                ...championOnDatabase[0],
                losing_matches: win ? newLoss : newLoss + 1,
                won_matches: win ? newWin + 1 : newWin,
                played_matches: newPlayed,
            };

            Database.enqueuePromise(this.updateChampion(championOnDatabase[0], newChamp));

        }
    }
}

export default new ChampionRepository();
