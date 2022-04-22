import { MatchIdsModel } from 'src/types';
import Database from '../database';
import { logger } from '../libs';
class MatchRepository {
    async getMatchIdExistsOnDatabase(id: string) {
        const connecion = Database.getConnection();
        const count = await connecion('matchs_ids').count('id', { as: 'cnt' }).where('id', id);

        if (count[0].cnt >= 1) {
            return true;
        } else {
            return false;
        }
    }

    async getMatchsIdsCount() {
        const connecion = Database.getConnection();
        const count = await connecion('matchs_ids').count('id', { as: 'cnt' });

        return count[0].cnt;
    }

    async saveMatchId(id: string) {
        logger.info(`[New match]: ${id}`);

        const connecion = Database.getConnection();

        connecion<MatchIdsModel>('matchs_ids').insert({ id })
            .then(() => {
                return;
            });
    }
}

export default new MatchRepository();