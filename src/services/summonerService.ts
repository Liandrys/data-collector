import { MatchV5DTOs } from 'twisted/dist/models-dto';
import { LeagueType, SummonerType } from '../types';
import SummonerRepository from '../repositories/SummonerRepository';
import ChampionService from '../services/championService';
import ChampionRepository from '../repositories/championRepository';
import Summoner from '../api/Summoner';

class SummonerService {
    /**
     * Giving a participant object from match information, parse it to a summoner object
     * @param participant The participant of the match
     * @param MatchId The match id of the match
     * @returns Giving a participant, return the summoner information to save on Summoners table
     */
    async getSummonerObjectFromParticipant(participant: MatchV5DTOs.ParticipantDto, MatchId: string): Promise<SummonerType> {
        const win = participant.win ? 1: 0;
        const lose = participant.win ? 0: 1;
        const leagues = await Summoner.getSummonerLeague(participant.summonerId);
        const date = new Date();

        const summoner: SummonerType = {
            name: participant.summonerName,
            played_matches: 1,
            won_matches: win,
            lost_matches: lose,
            level: participant.summonerLevel,
            last_update: new Date(date.setHours(date.getHours(), date.getMinutes(), 0, 0)),
            leagues,
            matches: [MatchId],
            puuid: participant.puuid,
            summoner_id: participant.summonerId,
        };

        return summoner;
    }

    /**
     * Giving a summoner object, return the summoner object updated with anew match.
     * Update the win/loss/played matches of the summoner
     * @param summoner The summoner object to update
     * @param matchId The id of the match
     * @param win is the summoner win the match
     * @returns The summoner object updated
     */
    getGetSummonerObjectUpdated(summoner: SummonerType, matchId: string, win: boolean): SummonerType {
        let newWin = summoner.won_matches;
        let newLose = summoner.lost_matches;
        let newPlayedMatches = summoner.played_matches;
        const newMatches = summoner.matches;

        if (win) {
            newWin += 1;
        } else {
            newLose += 1;
        }

        if (newMatches.indexOf(matchId) === -1) {
            newMatches.push(matchId);
            newPlayedMatches += 1;
        }

        const newSummonerObject: SummonerType = {
            ...summoner,
            played_matches: newPlayedMatches,
            matches: newMatches,
            won_matches: newWin,
            lost_matches: newLose,
        };

        return newSummonerObject;
    }

    /**
     * Save a participant on the database, if exist, update the matchs and win/loss/played matches
     * @param participant The participant of the match
     * @param matchId The match id of the match
     * @returns 
     */
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

    /**
     * Giving a participant, match id, game type and game mode
     * update the summoner information on the database
     * @param participant The participant of the match
     * @param matchId The new match
     * @param gameType If the game its matched or perso game
     * @param gameMode If the game mode is ranked, normal or anotherone game mode
     */
    async handleParticipant(participant: MatchV5DTOs.ParticipantDto, matchId: string, gameType: string, gameMode: string) {
        const summoner = await this.saveParticipant(participant, matchId);
        const leagues = summoner.leagues;
        let rankedSoloq;

        if (leagues && typeof leagues === 'object' && Array.isArray(leagues)) {
            // tslint:disable-next-line: one-variable-per-declaration
            const leaguesOb: LeagueType[] = leagues as unknown as LeagueType[];

            rankedSoloq = leaguesOb.find(league => league.queueType === 'RANKED_SOLO_5x5');
        }

        let championPlayed;

        if (rankedSoloq != null && rankedSoloq !== undefined) {
            championPlayed = ChampionService.getChampionPlayed(participant, rankedSoloq.tier);
        } else {
            championPlayed = ChampionService.getChampionPlayed(participant, 'UNRANKED');
        }

        if (gameType === 'MATCHED_GAME' && gameMode === 'CLASSIC') {
            await ChampionRepository.saveChampion(championPlayed, participant.win);
        } else {
            // Do nothing
        }
    }

    async getSummonersSavedOnDB() {
        return await SummonerRepository.getSummonersSavedOnDB();
    }
}

export default new SummonerService();
