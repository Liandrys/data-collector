import { MatchV5DTOs } from 'twisted/dist/models-dto';
import { ChampionStatsType } from '../types';

class ChampionService {
    /**
     * Giving a participant, return the champion information to save on Champions Stats table
     * @param participant The participant of the match
     * @param league League from SOLOQUEUE of the participant
     * @returns the object with the champion stats to save on DB
     */
    getChampionPlayed(participant: MatchV5DTOs.ParticipantDto, league: string) {
        let individualPosition;

        if (participant.individualPosition === 'Invalid') {
            individualPosition = 'AFK';
        } else {
            individualPosition = participant.individualPosition;
        }

        const championPlayed: ChampionStatsType = {
            champion_id: participant.championId,
            champion_name: participant.championName,
            individual_position: individualPosition,
            team_position: participant.teamPosition,
            id: `${participant.championId}_${participant.individualPosition}_${league}`,
            won_matches: 0,
            lost_matches: 0,
            played_matches: 0,
            tier: league,
        };

        return championPlayed;
    }
}

export default new ChampionService();
