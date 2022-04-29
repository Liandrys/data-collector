import DataCollector from './DataCollector';
import { config } from './config';

// tslint:disable-next-line: no-console
console.clear();

DataCollector.collectDataFromSummoner(config.defaultSummonerName)
    .then( () => {
        console.log('The data collector finished ;)');
    })
    .catch((error: string) => {
        console.log(error);
    });