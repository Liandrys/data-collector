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
import { LeagueType } from './types';

class Main {
    async dataCollector(summoner: string) {
        try {
            // AlgorithmStats.start();
            let firstSummoner;

            if (summoner) {
                firstSummoner = await Summoner.getSummonerByName(summoner);
            } else {
                firstSummoner = await Summoner.getSummonerByName(config.defaultSummonerName);
            }

            const matchlist = await MatchService.getMatchsIdList(firstSummoner.puuid);

            await this.mapMatchList(matchlist, summoner);
        } catch (error) {
            logger.error(error);
        }
    }

    async mapMatchList(matchsIds: string[], summonerName: string) {
        // TODO: ove to services
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
                await this.mapParticipants(participants, summonerName, match.metadata.matchId, match.info.gameType, match.info.gameMode);
            } else {
                continue;
            }
        }
    }

    async mapParticipants(participants: MatchV5DTOs.ParticipantDto[], summonerName: string, matchId: string, gameType: string, gameMode: string) {
        try {
            for (const element in participants) {
                // TODO: Move to services
                if (Object.prototype.hasOwnProperty.call(participants, element)) {
                    const participant = participants[element];
                    const summoner = await summonerService.saveParticipant(participant, matchId);
                    const leagues: LeagueType[] = JSON.parse(summoner.leagues);
                    const rankedSoloq = leagues.find((league: LeagueType) => league.queueType === 'RANKED_SOLO_5x5');
                    let championPlayed;

                    if (rankedSoloq !== undefined) {
                        championPlayed = ChampionService.getChampionPlayed(participant, rankedSoloq.tier);
                    } else {
                        championPlayed = ChampionService.getChampionPlayed(participant, 'UNRANKED');
                    }

                    if (gameType === 'MATCHED_GAME' && gameMode === 'CLASSIC') {
                        await ChampionRepository.saveChampion(championPlayed, participant.win);
                    } else {
                        // Do nothing
                        console.log('Not a ranked game');
                    }
                }
            }

            // TODO: ove to services
            lodash.remove(participants, (o) => {
                return o.summonerName === summonerName;
            });

            // TODO: ove to services
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
