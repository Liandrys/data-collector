import { config } from '../config';
import { LolApi } from 'twisted';
import { Api } from '.';
import { LeagueType } from 'src/types';

class Summoner {
    #api: LolApi;
    constructor() {
        this.#api = Api;
    }

    async getSummonerByName(summonerName:string) {
        return (await this.#api.Summoner.getByName(summonerName, config.defaultRegion)).response;
    }

    async getSummonerLeague(summonerId: string){
        const response = await this.#api.League.bySummoner(summonerId, config.defaultRegion);

        const leagues: LeagueType[] = [];

        response.response.forEach(lea => {
            leagues.push({
                freshBlood: lea.freshBlood,
                hotStreak: lea.hotStreak,
                inactive: lea.inactive,
                leaguePoints: lea.leaguePoints,
                losses: lea.losses,
                queueType: lea.queueType,
                rank: lea.rank,
                summonerId: lea.summonerId,
                summonerName: lea.summonerName,
                tier: lea.tier,
                veteran: lea.veteran,
                wins: lea.wins,
            });
        });

        return leagues;
    }
}

export default new Summoner();