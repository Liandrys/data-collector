import 'mocha';
import chai from 'chai';
const { expect } = chai;

import deepEqualInAnyOrder from 'deep-equal-in-any-order';
chai.use(deepEqualInAnyOrder);


import ChampionService from '../src/services/championService';
import { ChampionStatsType } from '../src/types';
import { ParticipantMock } from './mocks';

describe('Champions Service Testing', () => {
    it('Should return champion played object to save from a participant', () => {
        const expectChamp: ChampionStatsType = {
            id: '122_TOP',
            champion_id: 122,
            champion_name: 'Darius',
            team_position: 'TOP',
            individual_position: 'TOP',
            won_matches: 0,
            losing_matches: 0,
            played_matches: 0,
            tier: 'UNRANKED',
        };

        const champion = ChampionService.getChampionPlayed(ParticipantMock, 'UNRANKED');

       expect(champion).to.deep.equalInAnyOrder(expectChamp);

    });
});