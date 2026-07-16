import { useState, useEffect } from 'react';
import { filterByLeague, bucketMatches, mergeLiveUpdate } from '../utils/bucketing.js';
import { getApiResponse, getLiveData } from '../api/client.js';

const leagueIds = [40, 528, 46, 45, 48, 143, 140, 556, 135, 137, 547, 61, 66, 65, 253, 866, 257, 2]

export function useGames() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadInitialGames() {
            try {
                const matches = await getApiResponse();
                const filteredMatches = filterByLeague(matches, leagueIds);
                const bucketedMatches = bucketMatches(filteredMatches);

                setData(bucketedMatches);
                setLoading(false);
            }
            catch (err) {
                setError(err);
                setLoading(false);
            }
        }
        loadInitialGames();
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            async function pollLive() {
                const freshLive = await getLiveData();
                setData(prevData => {
                    const mergedData = mergeLiveUpdate(prevData.live, prevData.finished, freshLive);
                    return { ...prevData, ...mergedData };
                });
            }
            pollLive();
        }, 15000);

        return () => clearInterval(intervalId);
    }, []);

    return { data, loading, error };
}
