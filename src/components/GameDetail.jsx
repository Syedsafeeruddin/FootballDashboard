import { useParams, Link } from 'react-router-dom';

export function GameDetail({ data }) {
    const { id } = useParams();

    const matchDetails = data.live.concat(data.upcoming).concat(data.finished).concat(data.others);
    const match = matchDetails.find(m => m.fixture.id === Number(id));

    if (!match) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-neutral-400">
                <p className="text-sm">Match not found.</p>
                <Link to="/" className="text-sm text-amber-400 hover:underline">Back to Dashboard</Link>
            </div>
        );
    }

    const { fixture, league, teams, goals, statistics, lineups, events } = match;

    return (
        <div className="min-h-screen bg-black px-4 py-8 max-w-2xl mx-auto text-neutral-100">
            <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">← Back</Link>

            <div className="flex items-center gap-2 mt-6 mb-4 text-xs text-neutral-400">
                <img src={league.logo} alt={league.name} className="w-4 h-4 object-contain" />
                <span>{league.name}</span>
            </div>

            <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-2">
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <img src={teams.home.logo} alt={teams.home.name} className="w-10 h-10 object-contain" />
                    <span className="text-sm text-center">{teams.home.name}</span>
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                    {goals.home} - {goals.away}
                </div>
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <img src={teams.away.logo} alt={teams.away.name} className="w-10 h-10 object-contain" />
                    <span className="text-sm text-center">{teams.away.name}</span>
                </div>
            </div>

            <div className="text-center text-xs text-neutral-500 mb-8">{fixture.status.long}</div>

            <EventsList events={events} homeTeamId={teams.home.id} />

            {statistics && statistics.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {statistics.map((teamStats, i) => (
                            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                                <h4 className="text-sm font-medium mb-2">{teamStats.team?.name}</h4>
                                <ul className="space-y-1 text-xs text-neutral-400">
                                    {teamStats.statistics.map((stat, j) => (
                                        <li key={j} className="flex justify-between">
                                            <span>{stat.type}</span>
                                            <span className="text-neutral-200">{stat.value ?? '-'}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {lineups && lineups.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">Lineups</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {lineups.map((teamLineup, i) => (
                            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                                <h4 className="text-sm font-medium mb-2">{teamLineup.team?.name}</h4>
                                <ul className="space-y-1 text-xs text-neutral-400">
                                    {teamLineup.startXI?.map((p, j) => (
                                        <li key={j}>{p.player?.name}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function EventsList({ events, homeTeamId }) {
    if (!events || events.length === 0) return null;

    const sorted = [...events].sort((a, b) => a.time.elapsed - b.time.elapsed);

    return (
        <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">Match Events</h3>
            <ul className="space-y-2">
                {sorted.map((event, i) => (
                    <li
                        key={i}
                        className={`flex items-center gap-3 text-sm ${event.team.id === homeTeamId ? 'justify-start' : 'justify-end flex-row-reverse text-right'
                            }`}
                    >
                        <span className="font-mono text-xs text-neutral-500 w-10 shrink-0">
                            {event.time.elapsed}{event.time.extra ? `+${event.time.extra}` : ''}'
                        </span>
                        <span>{event.type === 'Goal' ? '⚽' : event.type === 'Card' ? '🟨' : '🔄'}</span>
                        <span className="text-neutral-200">{event.player?.name}</span>
                        {event.assist?.name && (
                            <span className="text-neutral-500 text-xs">(assist: {event.assist.name})</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}