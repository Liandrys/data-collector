export interface ChampionStatsType {
    id: string; // ${champion_id team_position tier}
    champion_id: number;
    champion_name: string;
    won_matches: number;
    losing_matches: number;
    tier: string;
    team_position: string;
    individual_position: string;
    played_matches: number;
}

export interface MatchType {
    match_id: string;
    game_id: number;
    game_duration: number;
    game_mode: string;
    game_type: string;
    game_version: string;
    participants: string;
    average_range?: string;
}

export interface LeagueType {
    wins: string;
    losses: string;
    veteran: boolean;
    inactive: boolean;
    hotStreak: boolean;
    queueType: string;
    freshBlood: boolean;
    summonerId: string;
    leaguePoints: string;
    summonerName: string;
    tier: string;
    rank: string;
}

export interface SummonerType {
    name: string;
    played_matches: number;
    won_matches: number;
    losing_matches: number;
    level: number;
    last_update: Date;
    leagues: string;
    matches: string[];
    puuid: string;
    summonerId: string;
}