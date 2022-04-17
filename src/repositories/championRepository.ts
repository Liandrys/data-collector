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

        return connecion<ChampionStatsModel>('championsStats').select().where('id', id)
            .then(result => {
                return result;
            });

    }

    async createChampion(champ: ChampionStatsModel, win: boolean) {
        const id = `${champ.championId}_${champ.teamPosition}`;
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
                championId: champ.championId,
                championName: champ.championName,
                individualPosition: champ.individualPosition,
                matchesLossed,
                matchesWinned,
                matchesPlayed: 1,
                teamPosition: champ.teamPosition
            };


            await connection<ChampionStatsModel>('championsStats').insert(champToSave).then( () =>{
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
            await connection<ChampionStatsModel>('championsStats').where('id', prevChamp.id).update(newChamp);
        } catch (error) {
            throw new Error('Error on update champion: ' + error);
        }
    }

    async getAllChampions(): Promise<ChampionStatsModel[] | null> {
        const connection = Database.getConnection();

        try {
            return await connection<ChampionStatsModel>('championsStats').select();
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
            const newWin = championOnDatabase[0].matchesWinned ? championOnDatabase[0].matchesWinned : 0;
            const newLoss = championOnDatabase[0].matchesLossed ? championOnDatabase[0].matchesLossed : 0;
            const newPlayed = championOnDatabase[0].matchesPlayed ? championOnDatabase[0].matchesPlayed + 1 : 1;

            const newChamp: ChampionStatsModel = {
                ...championOnDatabase[0],
                matchesLossed: win ? newLoss : newLoss + 1,
                matchesWinned: win ? newWin + 1 : newWin,
                matchesPlayed: newPlayed,
            };

            Database.enqueuePromise(this.updateChampion(championOnDatabase[0], newChamp));

        }
    }
}

export default new ChampionRepository();