# Liandry Data Collector
This repo contains the source code of the liandry data collector. Wich is used to get the data required by the Liandry project.

All the data its extracted through the [RIOT DEVELOPER API](https://developer.riotgames.com)

## Run the project
Before run the project please set the `.env` file on the root folder with the next information:

``` python
  DATABASE_NAME='XXXX-XXXXXX'
  DATABASE_USER='XXXXXXXXX'
  DATABASE_PASSWORD='XXXXXX_XXXXXX_XXXXXXX'
  DATABASE_HOST='XXXXX.XX.XXXXX.XXX'
  DATABASE_PORT=XXXX
  RIOT_API_LEY='XXXXXX-XXXXX-XXXXX-XXXXX-XX'
```

Then run `npm install`

To execute the project run `npm start`

## Database
The project works with PostgresSQL database.

## Features
The data collector can extract the next information from league and save it on the data base:
### Summoner
* [x] Name
* [x] Leagues
* [x] Level
* [x] Matches ids
* [x] Played matches
* [x] Won matches
* [x] Losing matches
* [x] Puuid
* [x] Summoner id
* [ ] More used champions

### Matches
* [x] Match id
* [x] Game id
* [x] Game duration
* [x] Game mode
* [x] Game type
* [x] Game version
* [x] Participants
* [ ] Average range
* [ ] Team MVP

## Champions Stats
* [x] Id: ```${champion_id}_${team_position}_${rank}```
* [x] Champion id
* [x] Champion name
* [x] Played matches
* [x] Won matches
* [x] Losing matches
* [x] Individual position
* [x] Team position
* [x] Rank
* [ ] Runes
* [ ] Match up

#### Disclaimer
Liandry Data Collector isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.