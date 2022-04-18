import { MatchIdsModel } from 'src/types';
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

class MatchRepository {
    async getMatchIdExistsOnDatabase(id: string) {
        const connecion = Database.getConnection();

        const count = await connecion('matchs_ids').count('id', { as: 'CNT' }).where('id', id);

        if (count[0].CNT === 0) {
            return true;
        } else {
            return false;
        }
    }

    async saveMatchId(id: string) {
        logger.info({
            message: `[New match]: ${id}`
        });

        const connecion = Database.getConnection();

        connecion<MatchIdsModel>('matchs_ids').insert({ id })
            .then(() => {
                return;
            });
    }
}

export default new MatchRepository();