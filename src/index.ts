import 'dotenv/config';
import Summoner from './summoner';
import Match from './match';
import Champion from './champion';
import { config } from './config';
import ChampionRepository from './repositories/championRepository';
import MatchRepository from './repositories/matchRepository';
import { createLogger, format, transports } from 'winston';
import { MatchV5DTOs } from 'twisted/dist/models-dto/matches';

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
        let firstSummoner;

        if (summoner) {
            firstSummoner = await Summoner.getSummonerByName(summoner);
        } else {
            firstSummoner = await Summoner.getSummonerByName(config.defaultSummonerName);
        }

        const matchlist = await Match.getMatchsIdList(firstSummoner.puuid);

        await this.mapMatchList(matchlist);

    }

    async mapMatchList(matchsIds: string[]) {
        matchsIds.forEach(async matchid => {
            // Get the information about this match
            Match.getMatchInfo(matchid)
                .then(async match => {

                    // Check if the map its not already scaned
                    const exists = await MatchRepository.getMatchIdExistsOnDatabase(matchid);

                    if (exists) {
                        const participants = match.info.participants;

                        await MatchRepository.saveMatchId(matchid);
                        await this.mapParticipants(participants);
                    } else {
                        return;
                    }
                });
        });
    }

    async mapParticipants(participants: MatchV5DTOs.ParticipantDto[]) {
        for (const element in participants) {
            if (Object.prototype.hasOwnProperty.call(participants, element)) {
                const participant = participants[element];

                const championPlayed = Champion.getChampionPlayed(participant);

                if (championPlayed.individualPosition === 'Invalid') {
                    continue;
                } else {
                    await ChampionRepository.saveChampion(championPlayed, participant.win);
                }
            }
        }

        for (const element in participants) {
            if (Object.prototype.hasOwnProperty.call(participants, element)) {
                const participant = participants[element];

                await this.dataCollector(participant.summonerName);
            }
        }
    }


}

const main = new Main();

main.dataCollector('Beleño')
    .then( () => {
        logger.info({
            message: 'The data collector finished ;)',
        });
});