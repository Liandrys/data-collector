import { MatchParticipant } from '@prisma/client';
import { logger } from '../libs';
import { Constants, LolApi } from 'twisted';
import { MatchV5DTOs } from 'twisted/dist/models-dto';
import { Api } from '../api';
import Database from '../database';
import MatchRepository from '../repositories/matchRepository';
import SummonerService from './summonerService';
import lodash from 'lodash';

import DataCollector from '../';
class MatchService {
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

    getMatchParticipants(participants: MatchV5DTOs.ParticipantDto[], matchId: string) {
        const matchParticipants: MatchParticipant[] = [];

        participants.forEach(participant => {
            const matchParticipant: MatchParticipant = {
                id: `${participant.puuid}_${matchId}`,
                assists: participant.assists,
                baronKills: participant.baronKills,
                championId: participant.championId,
                bountyLevel: participant.bountyLevel,
                champExperience: participant.champExperience,
                championName: participant.championName,
                championTransform: participant.championTransform,
                champLevel: participant.champLevel,
                consumablesPurchased: participant.consumablesPurchased,
                damageDealtToBuildings: participant.damageDealtToBuildings,
                damageDealtToObjectives: participant.damageDealtToObjectives,
                damageDealtToTurrets: participant.damageDealtToTurrets,
                damageSelfMitigated: participant.damageSelfMitigated,
                deaths: participant.deaths,
                detectorWardsPlaced: participant.detectorWardsPlaced,
                doubleKills: participant.doubleKills,
                dragonKills: participant.dragonKills,
                firstBloodAssist: participant.firstBloodAssist,
                firstBloodKill: participant.firstBloodKill,
                firstTowerAssist: participant.firstTowerAssist,
                firstTowerKill: participant.firstTowerKill,
                gameEndedInEarlySurrender: participant.gameEndedInEarlySurrender,
                goldEarned: participant.goldEarned,
                gameEndedInSurrender: participant.gameEndedInSurrender,
                goldSpent: participant.goldSpent,
                inhibitorKills: participant.inhibitorKills,
                individualPosition: participant.individualPosition,
                inhibitorsLost: participant.inhibitorsLost,
                inhibitorTakedowns: participant.inhibitorTakedowns,
                item0: participant.item0,
                item1: participant.item1,
                item2: participant.item2,
                item3: participant.item3,
                item4: participant.item4,
                item5: participant.item5,
                item6: participant.item6,
                itemsPurchased  : participant.itemsPurchased,
                killingSprees: participant.killingSprees,
                kills: participant.kills,
                lane: participant.lane,
                largestCriticalStrike: participant.largestCriticalStrike,
                largestKillingSpree: participant.largestKillingSpree,
                largestMultiKill: participant.largestMultiKill,
                longestTimeSpentLiving: participant.longestTimeSpentLiving,
                magicDamageDealt: participant.magicDamageDealt,
                magicDamageDealtToChampions: participant.magicDamageDealtToChampions,
                magicDamageTaken: participant.magicDamageTaken,
                neutralMinionsKilled: participant.neutralMinionsKilled,
                nexusKills: participant.nexusKills,
                nexusLost: participant.nexusLost,
                nexusTakedowns: participant.nexusTakedowns,
                objectivesStolen: participant.objectivesStolen,
                objectivesStolenAssists: participant.objectivesStolenAssists,
                participantId: participant.participantId,
                pentaKills: participant.pentaKills,
                physicalDamageDealt: participant.physicalDamageDealt,
                physicalDamageDealtToChampions: participant.physicalDamageDealtToChampions,
                physicalDamageTaken: participant.physicalDamageTaken,
                profileIcon: participant.profileIcon,
                puuid: participant.puuid,
                quadraKills: participant.quadraKills,
                riotIdName: participant.riotIdName,
                riotIdTagline: participant.riotIdTagline,
                role: participant.role,
                sightWardsBoughtInGame: participant.sightWardsBoughtInGame,
                spell1Casts: participant.spell1Casts,
                spell2Casts: participant.spell2Casts,
                spell3Casts: participant.spell3Casts,
                spell4Casts: participant.spell4Casts,
                summoner1Casts: participant.summoner1Casts,
                summoner1Id: participant.summoner1Id,
                summoner2Casts: participant.summoner2Casts,
                summoner2Id: participant.summoner2Id,
                summonerId: participant.summonerId,
                summonerLevel: participant.summonerLevel,
                summonerName: participant.summonerName,
                teamEarlySurrendered: participant.teamEarlySurrendered,
                teamId: participant.teamId,
                teamPosition: participant.teamPosition,
                timeCCingOthers: participant.timeCCingOthers,
                timePlayed: participant.timePlayed,
                totalDamageDealt: participant.totalDamageDealt,
                totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
                totalDamageShieldedOnTeammates  : participant.totalDamageShieldedOnTeammates,
                totalDamageTaken: participant.totalDamageTaken,
                totalHeal: participant.totalHeal,
                totalHealsOnTeammates: participant.totalHealsOnTeammates,
                totalMinionsKilled: participant.totalMinionsKilled,
                totalTimeCCDealt: participant.totalTimeCCDealt,
                totalTimeSpentDead: participant.totalTimeSpentDead,
                totalUnitsHealed: participant.totalUnitsHealed,
                tripleKills: participant.tripleKills,
                trueDamageDealt: participant.trueDamageDealt,
                trueDamageDealtToChampions: participant.trueDamageDealtToChampions,
                trueDamageTaken: participant.trueDamageTaken,
                turretKills: participant.turretKills,
                unrealKills: participant.unrealKills,
                turretsLost: participant.turretsLost,
                turretTakedowns: participant.turretTakedowns,
                visionScore: participant.visionScore,
                visionWardsBoughtInGame: participant.visionWardsBoughtInGame,
                wardsKilled: participant.wardsKilled,
                wardsPlaced: participant.wardsPlaced,
                win: participant.win
            };

            matchParticipants.push(matchParticipant);
        });

        return matchParticipants;
    }

    removeParticipantFromParticipants(participants: MatchV5DTOs.ParticipantDto[], summonerName: string) {
        return lodash.remove(participants, (o) => {
            return o.summonerName === summonerName;
        });
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
                const match = await this.getMatchInfo(matchid);
                const gameType = match.info.gameType;
                const gameMode = match.info.gameMode;

                const participants = match.info.participants;

                const participant1 = participants[0];
                const participant2 = participants[1];
                const participant3 = participants[2];
                const participant4 = participants[3];
                const participant5 = participants[4];
                const participant6 = participants[5];
                const participant7 = participants[6];
                const participant8 = participants[7];
                const participant9 = participants[8];
                const participant10 = participants[9];

                await SummonerService.handleParticipant(participant1, matchid, gameType, gameMode);
                await SummonerService.handleParticipant(participant2, matchid, gameType, gameMode);
                await SummonerService.handleParticipant(participant3, matchid, gameType, gameMode);
                await SummonerService.handleParticipant(participant4, matchid, gameType, gameMode);
                await SummonerService.handleParticipant(participant5, matchid, gameType, gameMode);
                await SummonerService.handleParticipant(participant6, matchid, gameType, gameMode);
                await SummonerService.handleParticipant(participant7, matchid, gameType, gameMode);
                await SummonerService.handleParticipant(participant8, matchid, gameType, gameMode);
                await SummonerService.handleParticipant(participant9, matchid, gameType, gameMode);
                await SummonerService.handleParticipant(participant10, matchid, gameType, gameMode);

                await MatchRepository.saveMatch(match, match.metadata.matchId);

                const participantWhioutSummoner = this.removeParticipantFromParticipants(participants, summonerName);

                await DataCollector.collectDataFromSummoner(participantWhioutSummoner[0].summonerName);
                await DataCollector.collectDataFromSummoner(participantWhioutSummoner[1].summonerName);
                await DataCollector.collectDataFromSummoner(participantWhioutSummoner[2].summonerName);
                await DataCollector.collectDataFromSummoner(participantWhioutSummoner[3].summonerName);
                await DataCollector.collectDataFromSummoner(participantWhioutSummoner[4].summonerName);
                await DataCollector.collectDataFromSummoner(participantWhioutSummoner[5].summonerName);
                await DataCollector.collectDataFromSummoner(participantWhioutSummoner[6].summonerName);
                await DataCollector.collectDataFromSummoner(participantWhioutSummoner[7].summonerName);
                await DataCollector.collectDataFromSummoner(participantWhioutSummoner[8].summonerName);

            } else {
                continue;
            }
        }
    }
}

export default new MatchService();