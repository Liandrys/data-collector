import { MatchIdsModel } from 'src/types';
import Database from '../database';
import { logger } from '../libs';
import { tablesNames } from '../sql';
import { MatchV5DTOs } from 'twisted/dist/models-dto';

class MatchRepository {

    async getMatchIdExistsOnDatabase(id: string) {
        try {
            const connecion = Database.getConnection();
            const count = await connecion(tablesNames.matches).count('match_id', { as: 'cnt' }).where('match_id', id);

            if (count[0].cnt >= 1) {
                return true;
            } else {
                return false;
            }

        } catch (error) {
            logger.error(error);
            return true;
        }
    }

    async getMatchsIdsCount() {
        const connecion = Database.getConnection();
        const count = await connecion(tablesNames.matches).count('id', { as: 'cnt' });

        return count[0].cnt;
    }

    async saveMatch(match: MatchV5DTOs.MatchDto, matchId: string) {
        logger.info(`[New match]: ${matchId}`);

        const connection = Database.getConnection();

        const matchToSave: MatchIdsModel = {
            game_id: match.info.gameId,
            match_id: matchId,
            game_duration: match.info.gameDuration,
            game_mode: match.info.gameMode,
            game_type: match.info.gameType,
            game_version: match.info.gameVersion,
            participants: JSON.stringify(match.info.participants),
        };

        connection<MatchIdsModel>(tablesNames.matches).insert(matchToSave)
            .then(() => {
                return;
            });
    }
}

export default new MatchRepository();
