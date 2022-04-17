import { Constants, LolApi } from 'twisted';
import { Api } from '../api';

class Match {
    #api: LolApi;
    constructor() {
        this.#api = Api;
    }

    async getMatchsIdList(acountId:string) {
        return (await this.#api.MatchV5.list(acountId, Constants.RegionGroups.AMERICAS, { count: 5, start: 0 })).response;
    }

    async getMatchInfo(matchId: string) {
        return (await this.#api.MatchV5.get(matchId, Constants.RegionGroups.AMERICAS)).response;
    }

}

export default new Match();