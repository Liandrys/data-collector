import Database from '../database';
import { tablesNames } from '../sql';
import { SummonerType } from '../types';

class SummonerRepository {

    async saveSummoner(summoner: SummonerType): Promise<SummonerType> {
        const connection = Database.getConnection();

        return connection<SummonerType>(tablesNames.summoners).insert(summoner).then(() => {
            return summoner;
        });
    }

    async getSummonerExistsByPuuid(puuid: string): Promise<boolean> {
        const connection = Database.getConnection();

        return connection<SummonerType>(tablesNames.summoners).select().where('puuid', puuid).then(result => {
            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        });
    }

    async updateSummoner(summoner: SummonerType): Promise<SummonerType> {
        const connection = Database.getConnection();

        return connection<SummonerType>(tablesNames.summoners).where('name', summoner.name).update(summoner).then(() => {
            return summoner;
        });
    }

}

export default new SummonerRepository();