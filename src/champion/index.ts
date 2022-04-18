import { MatchV5DTOs } from 'twisted/dist/models-dto';
import { ChampionStatsModel } from '../types';

class Champion {
    getChampionPlayed(participant: MatchV5DTOs.ParticipantDto) {
        const championPlayed: ChampionStatsModel = {
            champion_id: participant.championId,
            champion_name: participant.championName,
            individual_position: participant.individualPosition,
            team_position: participant.teamPosition,
            id: `${participant.championId}_${participant.teamPosition}`,
        };

        return championPlayed;
    }
}

export default new Champion();