import 'mocha';
import chai from 'chai';
import SummonerService from '../src/services/summonerService';

import deepEqualInAnyOrder from 'deep-equal-in-any-order';
chai.use(deepEqualInAnyOrder);

import { expect } from 'chai';

import { SummonerType } from '../src/types';
import { ParticipantMock } from './mocks';

describe('Summoner services tests', () => {
    let expectedSummoner: SummonerType;

    before((done) => {
        const date = new Date();
        expectedSummoner = {
            name: 'BarcoDeGangplank',
            played_matches: 1,
            won_matches: 1,
            losing_matches: 0,
            level: 3,
            last_update: new Date(date.setHours(date.getHours(), date.getMinutes(), 0, 0)),
            matches: ['LA1_12345'],
            puuid: '2Ae38IwPQUexv8j4JBInnInEBF7UX8_Pfah6MBxqc_ATzo9uhfeOVoYc6kFr2YAw1J-E3ejIy2Xh9g',
            summonerId: 'fL3dpMHo-zK3kA_Jtc5XwMdWI0G9s_u6lAaCEn88ZPZNOxMoth41Vvdx1w',
            leagues: '[]',
        };

        done();
    });

    it('should return summoner obtect from participant', async () => {
        const summoner = await SummonerService.getSummonerObjectFromParticipant(ParticipantMock, 'LA1_12345');

        expect(summoner).to.deep.equalInAnyOrder(expectedSummoner);
    });

    it('Should update summoner object', () => {
        const summonerUpdated: SummonerType = {
            ...expectedSummoner,
            won_matches: 2,
            played_matches: 2,
            matches: ['LA1_123456', 'LA1_12345'],
        };

        const summoner = SummonerService.getGetSummonerObjectUpdated(expectedSummoner, 'LA1_123456', true);

        expect(summoner).to.deep.equalInAnyOrder(summonerUpdated);
    });
});
