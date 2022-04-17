export interface ChampionStatsModel {
    id: string; // championId + position
    championId: number;
    championName: string;
    matchesPlayed?: number; // matchesWinned + matchesLossed
    matchesWinned?: number;
    matchesLossed?: number;
    individualPosition: string;
    teamPosition: string;
}

export interface MatchIdsModel {
    id: string;
};
