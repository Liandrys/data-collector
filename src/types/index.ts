// eslint-disable-next-line no-unused-vars
export type JsonObject = {[Key in string]?: JsonValue};

export type JsonArray = JsonValue[];

export type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

export interface ChampionStatsType {
    id: string
    champion_id: number
    champion_name: string
    won_matches: number
    lost_matches: number
    played_matches: number
    team_position: string
    individual_position: string
    tier: string
}

export interface MatchType {
    id: string
    game_id: number
    game_duration: number
    game_creation: Date
    game_mode: string
    game_type: string
    game_version: string
    average_rank: string
}

export interface LeagueType {
    wins: number;
    losses: number;
    veteran: boolean;
    inactive: boolean;
    hotStreak: boolean;
    queueType: string;
    freshBlood: boolean;
    summonerId: string;
    leaguePoints: number;
    summonerName: string;
    tier: string;
    rank: string;
}

export interface SummonerType {
    name: string;
    played_matches: number;
    won_matches: number;
    lost_matches: number;
    level: number;
    last_update: Date;
    leagues: LeagueType[];
    matches: string[];
    puuid: string;
    summoner_id: string;
}