import { MatchType } from '../types';
import Database from '../database';
import { logger } from '../libs';
import { MatchV5DTOs } from 'twisted/dist/models-dto';
import matchService from '../services/matchService';

class MatchRepository {

    /**
     * Search if a match is already saved on the database
     * @param id The id of the match
     * @returns true if the match is saved on DB, false otherwise
     */
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

    /**
     * Giving a match id, save it on the database
     * @param match Save the match on the database
     * @param matchId the id of the match
     */
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

    /**
     * Count all matches on the database
     * @returns The number of matches saved on the database
     */
    async getMatchesSavedOnDB() {
        const connection = Database.getConnection();

        const response = await connection.match.count();

        return response;
    }
}

export default new MatchRepository();
