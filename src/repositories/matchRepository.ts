import { MatchType } from '../types';
import Database from '../database';
import { logger } from '../libs';
import { MatchV5DTOs } from 'twisted/dist/models-dto';
import matchService from '../services/matchService';

class MatchRepository {

    async getMatchIdExistsOnDatabase(id: string) {
        try {
            const connecion = Database.getConnection();
            const response = await connecion.match.count({
                where: {
                    id
                },
            });
            if (response >= 1) {
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

        const response = await connecion.match.count();

        return response;
    }

    async saveMatch(match: MatchV5DTOs.MatchDto, matchId: string) {
        try {
            const connection = Database.getConnection();

            const matchToSave: MatchType = {
                game_id: match.info.gameId,
                id: matchId,
                game_duration: match.info.gameDuration,
                game_mode: match.info.gameMode,
                game_type: match.info.gameType,
                game_version: match.info.gameVersion,
                average_rank: '',
                game_creation: new Date(match.info.gameCreation),
            };

            const matchParticipants = matchService.getMatchParticipants(match.info.participants, matchId);

            await connection.match.create({
                data: {
                    ...matchToSave,
                    MatchParticipant: {
                        create: matchParticipants
                    }
                },
            });
        } catch (error) {
            console.log(error)
        }
    }

    async getMatchesSavedOnDB() {
        const connection = Database.getConnection();

        const response = await connection.match.count();

        return response;
    }
}

export default new MatchRepository();
