import { GameCard } from '../components/GameCard.jsx';

export function Dashboard({ data, loading, error }) {
    if (loading) {
        return (
            <div className="min-h-screen bg-pitch-black flex items-center justify-center text-sage text-sm font-body">
                Loading matches...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-pitch-black flex items-center justify-center text-live-red text-sm font-body">
                {error.message || 'Failed to load matches.'}
            </div>
        );
    }

    const sections = [
        { title: 'Live', matches: data.live, empty: 'No live matches.' },
        { title: 'Upcoming', matches: data.upcoming, empty: 'No upcoming matches.' },
        { title: 'Finished', matches: data.finished, empty: 'No finished matches.' },
    ];

    return (
        <div className="min-h-screen bg-pitch-black">
            <div className="hero-floodlight px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <p className="font-mono text-xs uppercase tracking-widest text-floodlight mb-2">Matchday</p>
                    <h1 className="font-display text-4xl font-bold text-chalk">Today's Fixtures</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {sections.map(({ title, matches, empty }) => (
                    <section key={title} className="mb-10">
                        <div className="flex items-center gap-2 mb-3">
                            <h2 className="font-display text-xs font-semibold uppercase tracking-wide text-sage">{title}</h2>
                            <span className="font-mono text-xs text-turf-line">{matches.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {matches.length > 0 ? (
                                matches.map(match => <GameCard key={match.fixture.id} match={match} />)
                            ) : (
                                <p className="text-sm text-turf-line col-span-full font-body">{empty}</p>
                            )}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}