import { LolApi } from 'twisted';
export const Api = new LolApi({
    key: process.env.RIOT_API_LEY,
    concurrency: 1,
    rateLimitRetryAttempts: 3
});

