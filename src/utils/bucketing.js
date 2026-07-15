export const liveCodes = ["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE"];
export const fullTimeCodes = ["FT", "AET", "PEN"];

// Filter matches by league IDs

export function filterByLeague(matches, leagueIds) {
    return matches.filter((match) => leagueIds.includes(match.league.id));
}

// Categorize matches into buckets based on their status

export function bucketMatches(matches) {
    let live = [];
    let upcoming = [];
    let finished = [];
    let others = [];

    for (const match of matches) {
        let status = match.fixture.status.short;

        if (liveCodes.includes(status)) {
            live.push(match);
        } else if (status === "NS" || status === "TBD") {
            upcoming.push(match);
        } else if (fullTimeCodes.includes(status)) {
            finished.push(match);
        } else {
            others.push(match);
        }
    }

    return { live, upcoming, finished, others };
}

export function mergeLiveUpdate(oldLive, oldFinished, freshLive) {
    // find matches that dropped out of live (they finished)
    const newlyFinished = oldLive.filter(
        (oldLiveMatch) =>
            !freshLive.some(
                (freshMatch) => freshMatch.fixture.id === oldLiveMatch.fixture.id,
            ),
    );

    return {
        live: freshLive,
        finished: oldFinished.concat(newlyFinished),
    };
}
