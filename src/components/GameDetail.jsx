import { useParams, Link } from 'react-router-dom';

export function GameDetail({ data }) {
    const { id } = useParams();
    const matchDetails = data.live.concat(data.upcoming).concat(data.finished).concat(data.others);
    const match = matchDetails.find(m => m.fixture.id === Number(id));

    if (!match) {
        return (
            <div className="min-h-screen bg-pitch-black flex flex-col items-center justify-center gap-3">
                <p className="text-sm text-sage font-body">Match not found.</p>
                <Link to="/" className="text-sm text-floodlight hover:underline font-body">Back to Dashboard</Link>
            </div>
        );
    }

    const { fixture, league, teams, goals, events } = match;

    return (
        <div className="min-h-screen bg-pitch-black px-4 py-8 max-w-2xl mx-auto text-chalk">
            <Link to="/" className="text-sm text-sage hover:text-chalk transition-colors font-body">← Back</Link>

            <div className="flex items-center gap-2 mt-6 mb-4 text-xs text-sage font-body">
                <img src={league.logo} alt={league.name} className="w-4 h-4 object-contain" />
                <span>{league.name}</span>
            </div>

            <div className="flex items-center justify-between bg-turf border border-turf-line rounded-lg p-6 mb-2">
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <img src={teams.home.logo} alt={teams.home.name} className="w-10 h-10 object-contain" />
                    <span className="text-sm text-center font-display font-semibold">{teams.home.name}</span>
                </div>
                <div className="text-2xl font-mono font-bold text-chalk">{goals.home} - {goals.away}</div>
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <img src={teams.away.logo} alt={teams.away.name} className="w-10 h-10 object-contain" />
                    <span className="text-sm text-center font-display font-semibold">{teams.away.name}</span>
                </div>
            </div>

            <div className="text-center text-xs text-sage mb-8 font-mono">{fixture.status.long}</div>

            <EventsList events={events} homeTeamId={teams.home.id} />
        </div>
    );
}

function EventsList({ events, homeTeamId }) {
    if (!events || events.length === 0) return null;
    const sorted = [...events].sort((a, b) => a.time.elapsed - b.time.elapsed);

    return (
        <div className="mb-8">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-sage mb-3">Match Events</h3>
            <ul className="space-y-2">
                {sorted.map((event, i) => (
                    <li key={i} className={`flex items-center gap-3 text-sm font-body ${event.team.id === homeTeamId ? 'justify-start' : 'justify-end flex-row-reverse text-right'}`}>
                        <span className="font-mono text-xs text-sage w-10 shrink-0">
                            {event.time.elapsed}{event.time.extra ? `+${event.time.extra}` : ''}'
                        </span>
                        <span>{event.type === 'Goal' ? '⚽' : event.type === 'Card' ? '🟨' : '🔄'}</span>
                        <span className="text-chalk">{event.player?.name}</span>
                        {event.assist?.name && <span className="text-sage text-xs">(assist: {event.assist.name})</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}