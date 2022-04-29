import { MatchParticipant } from '@prisma/client';
import { Constants, LolApi } from 'twisted';
import { MatchV5DTOs } from 'twisted/dist/models-dto';
import { Api } from '../api';

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
}

export default new MatchService();