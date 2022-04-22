import MatchRepository from '../repositories/matchRepository';
import { createObjectCsvWriter } from 'csv-writer';

class AlgorithmStats {
    countFileName;
    countData: {
        time: string;
        count: string | number;
    }[] | [{}] = [{   }];

    constructor() {
        const currentDate = new Date();
        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const dateString = currentDayOfMonth + '-' + (currentMonth + 1) + '-' + currentYear;

        this.countFileName = `./log/${dateString}.csv`;
    }

    async start() {
        await this.#recordMatchsIdsCount();
        setTimeout(this.start, 20000);
    }

    async #recordMatchsIdsCount() {
        const count  = await MatchRepository.getMatchsIdsCount();

        const newData = {
            time: new Date().toLocaleTimeString(),
            count
        };

        this.countData.push(newData);

        const csvWriter = createObjectCsvWriter({
            path: this.countFileName,
            header: [
                { id: 'time', title: 'time' },
                { id: 'count', title: 'count' }
            ],
        });

        console.log(this.countFileName);

        await csvWriter.writeRecords(this.countData);

    }
}

export default new AlgorithmStats();
