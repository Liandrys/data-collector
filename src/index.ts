import 'dotenv/config';
import { logger } from './libs';
import Summoner from './api/Summoner';
import MatchService from './services/matchService';

class DataCollector {
    async collectDataFromSummoner(summonerName: string) {
        try {
            const firstSummoner = await Summoner.getSummonerByName(summonerName);

            const matchlist = await MatchService.getMatchsIdList(firstSummoner.puuid);

            await MatchService.mapMatchList(matchlist, summonerName);
        } catch (error) {
            logger.error(error);
        }
    }
}

export default new DataCollector();
