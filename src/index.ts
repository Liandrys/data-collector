import 'dotenv/config';
import Summoner from './summoner';
import Match from './match';
import Champion from './champion';
import { config } from './config';
import ChampionRepository from './repositories/championRepository';
import MatchRepository from './repositories/matchRepository';
import { createLogger, format, transports } from 'winston';
import { MatchV5DTOs } from 'twisted/dist/models-dto/matches';
import Database from './database';
import lodash from 'lodash';

export const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: 'your-service-name' },
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }));
}


class Main {
    async dataCollector(summoner: string) {
        try {
            let firstSummoner;

            if (summoner) {
                firstSummoner = await Summoner.getSummonerByName(summoner);
            } else {
                firstSummoner = await Summoner.getSummonerByName(config.defaultSummonerName);
            }

            const matchlist = await Match.getMatchsIdList(firstSummoner.puuid);

            await this.mapMatchList(matchlist, summoner);
        } catch (error) {
            logger.error(new Error(error));
        }

    }

    async mapMatchList(matchsIds: string[], summonerName: string) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < matchsIds.length; index++) {
            const matchid = matchsIds[index];

            // Check if the map its not already scaned
            const promiseQueueSize = Database.getPromiseQueueItsEmpty();

            if (!promiseQueueSize) {
                logger.warn({
                    message: 'Waiting to promises queue finish...'
                });
                index =- 1;
                continue;
            }

            const exists = await MatchRepository.getMatchIdExistsOnDatabase(matchid);

            if (exists === false) {
                const match = await Match.getMatchInfo(matchid);
                const participants = match.info.participants;

                await MatchRepository.saveMatchId(matchid);
                await this.mapParticipants(participants, summonerName);
            } else {
                continue;
            }
        }

    }

    async mapParticipants(participants: MatchV5DTOs.ParticipantDto[], summonerName: string) {
        for (const element in participants) {
            if (Object.prototype.hasOwnProperty.call(participants, element)) {
                const participant = participants[element];
                const championPlayed = Champion.getChampionPlayed(participant);

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
    }


}

const main = new Main();

main.dataCollector(config.defaultSummonerName)
    .then( () => {
        logger.info({
            message: 'The data collector finished ;)',
        });
});