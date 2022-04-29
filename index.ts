import DataCollector from './src';
import { config } from './src/config';

DataCollector.collectDataFromSummoner(config.defaultSummonerName)
    .then( () => {
        console.log('The data collector finished ;)');
    })
    .catch((error: string) => {
        console.log(error);
    });