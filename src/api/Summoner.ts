import { config } from '../config';
import { LolApi } from 'twisted';
import { Api } from '.';
import { LeagueType } from 'src/types';

class Summoner {
    #api: LolApi;
    constructor() {
        this.#api = Api;
    }

    /**
     * Giving a summoner name, get the summoner information from /summoner/V5
     * @param summonerName The name of the summoner
     * @returns The summoner information from RIOT API
     */
    async getSummonerByName(summonerName:string) {
        return (await this.#api.Summoner.getByName(summonerName, config.defaultRegion)).response;
    }

    /**
     * Giving a summoner id, get the summoner information from /league/V5
     * @param summonerId summonerId of the summoner
     * @returns the summoner league information from RIOT API
     */
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