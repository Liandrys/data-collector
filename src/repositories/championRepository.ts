import { ChampionStatsModel } from 'src/types';
import { createLogger, format, transports } from 'winston';
import Database from '../database';

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


class ChampionRepository {

    async getChampionById(id: string): Promise<ChampionStatsModel[]> {
        const connecion = Database.getConnection();

        return connecion<ChampionStatsModel>('champions_stats').select().where('id', id)
            .then(result => {
                return result;
            });

    }

    async createChampion(champ: ChampionStatsModel, win: boolean) {
        const id = `${champ.champion_id}_${champ.team_position}`;
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
                matchesLossed,
                matchesWinned,
                matchesPlayed: 1,
                team_position: champ.team_position
            };

            await connection<ChampionStatsModel>('champions_stats').insert(champToSave).then( () =>{
                logger.info({
                    message: `Champion with id ${champToSave.id} saved on the database`
                });
            });
        } catch (error) {
            throw new Error('Error on create a champion: ' + error);
        }
    }

    async updateChampion(prevChamp: ChampionStatsModel, newChamp: ChampionStatsModel) {
        const connection = Database.getConnection();

        try {
            await connection<ChampionStatsModel>('champions_stats').where('id', prevChamp.id).update(newChamp);
        } catch (error) {
            throw new Error('Error on update champion: ' + error);
        }
    }

    async getAllChampions(): Promise<ChampionStatsModel[] | null> {
        const connection = Database.getConnection();

        try {
            return await connection<ChampionStatsModel>('champions_stats').select();
        } catch (error) {
            return null;
        }
    }

    async saveChampion(champion: ChampionStatsModel, win: boolean): Promise<void>{
        const championOnDatabase = await this.getChampionById(champion.id);

        // The champion dosent exist on the database
        if (championOnDatabase.length === 0) {
            // There is not a chmpion on database, create a new one
            // await this.createChampion(champion, win);
            Database.enqueuePromise(this.createChampion(champion, win));
        } else {
            const newWin = championOnDatabase[0].matches_winned ? championOnDatabase[0].matches_winned : 0;
            const newLoss = championOnDatabase[0].matches_lossed ? championOnDatabase[0].matches_lossed : 0;
            const newPlayed = championOnDatabase[0].matches_played ? championOnDatabase[0].matches_played + 1 : 1;

            const newChamp: ChampionStatsModel = {
                ...championOnDatabase[0],
                matches_lossed: win ? newLoss : newLoss + 1,
                matches_winned: win ? newWin + 1 : newWin,
                matches_played: newPlayed,
            };

            Database.enqueuePromise(this.updateChampion(championOnDatabase[0], newChamp));

        }
    }
}

export default new ChampionRepository();