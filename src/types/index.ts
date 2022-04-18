export interface ChampionStatsModel {
    id: string; // champion_id + position
    champion_id: number;
    champion_name: string;
    matches_played?: number; // matchesWinned + matchesLossed
    matches_winned?: number;
    matches_lossed?: number;
    individual_position: string;
    team_position: string;
}

export interface MatchIdsModel {
    id: string;
}
