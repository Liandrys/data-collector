import 'dotenv/config';
import { logger } from './libs';
import Summoner from './api/Summoner';
import SummonerService from './services/summonerService';
import MatchService from './services/matchService';
import logUpdate from 'log-update';

class DataCollector {
    /**
     * Get summoner information from RIOT API and save it on DB
     * @param summonerName The name of the summoner
     */
    async collectDataFromSummoner(summonerName: string) {
        try {
            const firstSummoner = await Summoner.getSummonerByName(summonerName);
            const matchlist = await MatchService.getMatchsIdList(firstSummoner.puuid);

            await MatchService.mapMatchList(matchlist, summonerName);

        } catch (error) {
            logger.error(error);
        }
    }

    /**
     * Each match is saved on DB print the status of the process
     */
    async UpdateLog() {
        const summonersCount = await SummonerService.getSummonersSavedOnDB();
        const matchsCount = await MatchService.getMatchesSavedOnDB();

        logUpdate(` Summoners: ${summonersCount} - Matchs: ${matchsCount}
        `);
    }
}

export default new DataCollector();
