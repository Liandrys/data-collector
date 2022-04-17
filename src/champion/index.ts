import { MatchV5DTOs } from 'twisted/dist/models-dto';
import { ChampionStatsModel } from '../types';

class Champion {
    getChampionPlayed(participant: MatchV5DTOs.ParticipantDto) {
        const championPlayed: ChampionStatsModel = {
            championId: participant.championId,
            championName: participant.championName,
            individualPosition: participant.individualPosition,
            teamPosition: participant.teamPosition,
            id: `${participant.championId}_${participant.teamPosition}`,
        };

        return championPlayed;
    }
}

export default new Champion();