import { config } from '../config';
import { LolApi } from 'twisted';
import { Api } from '.';

class Summoner {
    #api: LolApi;
    constructor() {
        this.#api = Api;
    }

    async getSummonerByName(summonerName:string) {
        return (await this.#api.Summoner.getByName(summonerName, config.defaultRegion)).response;
    }

    async getSummonerLeague(summonerId: string){
        return (await this.#api.League.bySummoner(summonerId, config.defaultRegion)).response;
    }
}

export default new Summoner();