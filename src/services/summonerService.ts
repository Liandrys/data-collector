import { MatchV5DTOs } from 'twisted/dist/models-dto';
import { SummonerType } from '../types';
import SummonerRepository from '../repositories/SummonerRepository';
import Summoner from '../api/Summoner';

class SummonerService {
    async getSummonerObjectFromParticipant(participant: MatchV5DTOs.ParticipantDto, MatchId: string): Promise<SummonerType> {
        const win = participant.win ? 1: 0;
        const lose = participant.win ? 0: 1;
        const leagues = await Summoner.getSummonerLeague(participant.summonerId);
        const date = new Date();

        const summoner: SummonerType = {
            name: participant.summonerName,
            played_matches: 1,
            won_matches: win,
            losing_matches: lose,
            level: participant.summonerLevel,
            last_update: new Date(date.setHours(date.getHours(), date.getMinutes(), 0, 0)),
            leagues: JSON.stringify(leagues),
            matches: [MatchId],
            puuid: participant.puuid,
            summonerId: participant.summonerId,
        };

        return summoner;
    }

    getGetSummonerObjectUpdated(summoner: SummonerType, matchId: string, win: boolean): SummonerType {
        let newWin = summoner.won_matches;
        let newLose = summoner.losing_matches;
        let newPlayedMatches = summoner.played_matches;
        const newMatches = summoner.matches;

        if (win) {
            newWin += 1;
        } else {
            newLose += 1;
        }

        newPlayedMatches += 1;

        newMatches.push(matchId);

        const newSummonerObject: SummonerType = {
            ...summoner,
            played_matches: newPlayedMatches,
            matches: newMatches,
            won_matches: newWin,
            losing_matches: newLose,
        };

        return newSummonerObject;
    }

    async saveParticipant(participant: MatchV5DTOs.ParticipantDto, matchId: string) {
        const ifSummonerExist = await SummonerRepository.getSummonerExistsByPuuid(participant.puuid);

        if (ifSummonerExist) {
            const summoner = await this.getSummonerObjectFromParticipant(participant, matchId);
            const newSummonerObject = this.getGetSummonerObjectUpdated(summoner, matchId, participant.win);
            return await SummonerRepository.updateSummoner(newSummonerObject);
        } else {
            const summoner = await this.getSummonerObjectFromParticipant(participant, matchId);

            return await SummonerRepository.saveSummoner(summoner);
        }
    }

}

export default new SummonerService();
