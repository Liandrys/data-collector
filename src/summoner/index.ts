import { config } from '../config';
import { LolApi } from 'twisted';
import { Api } from '../api';

class Summoner {
    #api: LolApi;
    constructor() {
        this.#api = Api;
    }

    async getSummonerByName(summonerName:string) {
        return await (await this.#api.Summoner.getByName(summonerName, config.defaultRegion)).response;
    }
}

export default new Summoner();