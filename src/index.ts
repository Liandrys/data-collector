import 'dotenv/config';
import { logger } from './libs';
import Summoner from './api/Summoner';
import MatchService from './services/matchService';
import ChampionService from './services/championService';
import { config } from './config';
import ChampionRepository from './repositories/championRepository';
import MatchRepository from './repositories/matchRepository';
import { MatchV5DTOs } from 'twisted/dist/models-dto/matches';
import Database from './database';
import lodash from 'lodash';
import summonerService from './services/summonerService';

class Main {
    async dataCollector(summoner: string) {
        try {
            // AlgorithmStats.start();
            let firstSummoner;

            if (summoner) {
                firstSummoner = await Summoner.getSummonerByName(summoner);
            } else {1
                firstSummoner = await Summoner.getSummonerByName(config.defaultSummonerName);
            }

            const matchlist = await MatchService.getMatchsIdList(firstSummoner.puuid);

            await this.mapMatchList(matchlist, summoner);
        } catch (error) {
            logger.error(error);
        }
    }

    async mapMatchList(matchsIds: string[], summonerName: string) {
        // tslint:disable-next-line: prefer-for-of

        for (let index = 0; index < matchsIds.length; index++) {
            const matchid = matchsIds[index];

            // Check if the map its not already scaned
            const promiseQueueSize = Database.getPromiseQueueItsEmpty();

            if (!promiseQueueSize) {
                // logger.warn('Waiting to promises queue finish...');
                logger.warn('Cleaning database');
                Database.cleanPromiseQueue();
                index =- 1;
                continue;
            }

            const exists = await MatchRepository.getMatchIdExistsOnDatabase(matchid);

            if (exists === false) {
                const match = await MatchService.getMatchInfo(matchid);
                const participants = match.info.participants;

                await MatchRepository.saveMatch(match, match.metadata.matchId);
                await this.mapParticipants(participants, summonerName, match.metadata.matchId);
            } else {
                continue;
            }
        }
    }

    async mapParticipants(participants: MatchV5DTOs.ParticipantDto[], summonerName: string, matchId: string) {
        try {
            for (const element in participants) {
                if (Object.prototype.hasOwnProperty.call(participants, element)) {
                    const participant = participants[element];
                    const championPlayed = ChampionService.getChampionPlayed(participant);

                    await summonerService.saveParticipant(participant, matchId);

                    if (championPlayed.individual_position === 'Invalid') {
                        continue;
                    } else {
                        await ChampionRepository.saveChampion(championPlayed, participant.win);

                    }
                }
            }

            lodash.remove(participants, (o) => {
                return o.summonerName === summonerName;
            });

            for (const element in participants) {
                if (Object.prototype.hasOwnProperty.call(participants, element)) {
                    const participant = participants[element];

                    await this.dataCollector(participant.summonerName);
                }
            }
        } catch (error) {
            console.log(error);
            logger.error(error);
        }
    }
}

const main = new Main();

main.dataCollector(config.defaultSummonerName)
    .then( () => {
        logger.info('The data collector finished ;)');
    })
    .catch((error: string) => {
        logger.error(error);
    });
