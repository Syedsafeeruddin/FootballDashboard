import { Link } from 'react-router-dom';
import { liveCodes, fullTimeCodes } from '../utils/bucketing.js';
import { memo } from 'react';

export function GameCardImpl({ match }) {
    return (
        <Link
            to={`/game/${match.fixture.id}`}
            className="block bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-neutral-600 transition-colors"
        >
            <div className="flex items-center gap-2 mb-3 text-xs text-neutral-400">
                <img src={match.league.logo} alt={match.league.name} className="w-4 h-4 object-contain" />
                <span className="truncate">{match.league.name}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-6 h-6 object-contain shrink-0" />
                    <span className="text-sm text-neutral-100 truncate">{match.teams.home.name}</span>
                </div>
                <span className="text-sm font-mono font-semibold text-white ml-2">{match.goals.home}</span>
            </div>

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-6 h-6 object-contain shrink-0" />
                    <span className="text-sm text-neutral-100 truncate">{match.teams.away.name}</span>
                </div>
                <span className="text-sm font-mono font-semibold text-white ml-2">{match.goals.away}</span>
            </div>

            <div className="pt-2 border-t border-neutral-800">
                {renderStatus(match)}
            </div>
        </Link>
    );
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

function renderStatus(match) {
    const { short, elapsed } = match.fixture.status;

    const liveStatuses = liveCodes;
    const upcomingStatuses = ['TBD', 'NS'];

    if (liveStatuses.includes(short)) {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE {elapsed && `• ${elapsed}'`}
            </span>
        );
    }

    if (upcomingStatuses.includes(short)) {
        const kickoff = new Date(match.fixture.date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        return (
            <span className="text-xs font-medium text-amber-400">
                {kickoff}
            </span>
        );
    }

    return (
        <span className="text-xs font-medium text-neutral-500">
            {short}
        </span>
    );
}

export const GameCard = memo(GameCardImpl, areEqual);