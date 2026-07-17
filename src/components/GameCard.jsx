import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { liveCodes, fullTimeCodes } from '../utils/bucketing.js';

function GameCardImpl({ match }) {
    const prevScoreRef = useRef({ home: match.goals.home, away: match.goals.away });
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        const prev = prevScoreRef.current;
        if (prev.home !== match.goals.home || prev.away !== match.goals.away) {
            setFlash(true);
            const timer = setTimeout(() => setFlash(false), 900);
            prevScoreRef.current = { home: match.goals.home, away: match.goals.away };
            return () => clearTimeout(timer);
        }
    }, [match.goals.home, match.goals.away]);

    return (
        <Link
            to={`/game/${match.fixture.id}`}
            className="block bg-turf border border-turf-line rounded-lg p-4 hover:border-floodlight/50 transition-colors"
        >
            <div className="flex items-center gap-2 mb-3 text-xs text-sage font-body">
                <img src={match.league.logo} alt={match.league.name} className="w-4 h-4 object-contain" />
                <span className="truncate">{match.league.name}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-6 h-6 object-contain shrink-0" />
                    <span className="text-sm font-display font-semibold text-chalk truncate">{match.teams.home.name}</span>
                </div>
                <span className={`text-lg font-mono font-semibold ml-2 transition-colors ${flash ? 'text-floodlight' : 'text-chalk'}`}>
                    {match.goals.home}
                </span>
            </div>

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-6 h-6 object-contain shrink-0" />
                    <span className="text-sm font-display font-semibold text-chalk truncate">{match.teams.away.name}</span>
                </div>
                <span className={`text-lg font-mono font-semibold ml-2 transition-colors ${flash ? 'text-floodlight' : 'text-chalk'}`}>
                    {match.goals.away}
                </span>
            </div>

            <div className="pt-2 border-t border-turf-line">
                {renderStatus(match)}
            </div>
        </Link>
    );
}

function renderStatus(match) {
    const { short, elapsed } = match.fixture.status;
    const upcomingStatuses = ['TBD', 'NS'];

    if (liveCodes.includes(short)) {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-live-red">
                <span className="w-1.5 h-1.5 rounded-full bg-live-red animate-pulse" />
                LIVE {elapsed && `• ${elapsed}'`}
            </span>
        );
    }

    if (upcomingStatuses.includes(short)) {
        const kickoff = new Date(match.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return <span className="text-xs font-mono font-medium text-floodlight">{kickoff}</span>;
    }

    return <span className="text-xs font-mono font-medium text-sage">{short}</span>;
}

function areEqual(prevProps, nextProps) {
    const prev = prevProps.match;
    const next = nextProps.match;
    return (
        prev.goals.home === next.goals.home &&
        prev.goals.away === next.goals.away &&
        prev.fixture.status.short === next.fixture.status.short &&
        prev.fixture.status.elapsed === next.fixture.status.elapsed
    );
}

export const GameCard = memo(GameCardImpl, areEqual);