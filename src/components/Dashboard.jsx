import { GameCard } from "../components/GameCard.jsx";

export function Dashboard({ data, loading, error }) {
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">
                Loading matches...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400 text-sm">
                {error.message || "Failed to load matches."}
            </div>
        );
    }

    const sections = [
        { title: "Live", matches: data.live, empty: "No live matches." },
        {
            title: "Upcoming",
            matches: data.upcoming,
            empty: "No upcoming matches.",
        },
        {
            title: "Finished",
            matches: data.finished,
            empty: "No finished matches.",
        },
        { 
            title: "Other", 
            matches: data.others, 
            empty: "No other matches." 
        },
    ];

    return (
        <div className="min-h-screen bg-black px-4 py-8 max-w-3xl mx-auto">
            <h1 className="text-xl font-semibold text-white mb-8">Matchday</h1>

            {sections.map(({ title, matches, empty }) => (
                <section key={title} className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                            {title}
                        </h2>
                        <span className="text-xs text-neutral-600">{matches.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {matches.length > 0 ? (
                            matches.map((match) => (
                                <GameCard key={match.fixture.id} match={match} />
                            ))
                        ) : (
                            <p className="text-sm text-neutral-600 col-span-full">{empty}</p>
                        )}
                    </div>
                </section>
            ))}
        </div>
    );
}
