CREATE TABLE IF NOT EXISTS summoners (
	name VARCHAR,
	played_matches Integer,
	won_matches Integer,
	losing_matches Integer,
	level SMALLINT,
	last_update TIMESTAMP,
	leagues json,
	matches TEXT[]
);

CREATE TABLE IF NOT EXISTS matches (
	match_id VARCHAR PRIMARY KEY,
	game_id VARCHAR,
	game_duration INT,
	game_mode VARCHAR,
	game_type VARCHAR,
	game_version VARCHAR,
	participants jsonb,
	average_range VARCHAR
);

CREATE TABLE IF NOT EXISTS champions_stats (
	id VARCHAR PRIMARY KEY,
	champion_id Integer,
	champion_name VARCHAR,
	won_matches Integer,
	losing_matches Integer,
	played_matches Integer,
	team_position VARCHAR,
	individual_position VARCHAR,
	tier VARCHAR
);

