export interface ChampionStatsModel {
    id: string; // ${champion_id team_position tier}
    champion_id: number;
    champion_name: string;
    won_matches: number;
    losing_matches: number;
    tier?: string;
    team_position: string;
    individual_position: string;
    played_matches: number;
}

export interface MatchIdsModel {
    match_id: string;
    game_id: number;
    game_duration: number;
    game_mode: string;
    game_type: string;
    game_version: string;
    participants: string;
    average_range?: string;
}
