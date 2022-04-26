import { MatchV5DTOs } from 'twisted/dist/models-dto';
import { ChampionStatsType } from '../types';

class ChampionService {
    getChampionPlayed(participant: MatchV5DTOs.ParticipantDto) {
        const championPlayed: ChampionStatsType = {
            champion_id: participant.championId,
            champion_name: participant.championName,
            individual_position: participant.individualPosition,
            team_position: participant.teamPosition,
            id: `${participant.championId}_${participant.teamPosition}`,
            won_matches: 0,
            losing_matches: 0,
            played_matches: 0,
        };

        return championPlayed;
    }
}

export default new ChampionService();
