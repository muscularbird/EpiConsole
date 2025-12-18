import { useEffect } from "react";
import { useNavigate } from "react-router";

const Feature = ({ title, description }: { title: string; description: string }) => (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-lg backdrop-blur">
        <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

export default function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <div
            className="relative min-h-screen overflow-hidden bg-background text-foreground"
            style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--background) 88%, transparent), color-mix(in srgb, var(--primary) 12%, transparent))'
            }}
        >
            {/* glow accents using theme tokens */}
            <div
                className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 40%, transparent), transparent 60%)' }}
            />
            <div
                className="pointer-events-none absolute right-10 bottom-[-120px] h-80 w-80 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent, var(--secondary)) 30%, transparent), transparent 65%)' }}
            />

            <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-16 md:px-10 lg:px-14">
                {/* Hero */}
                <header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="space-y-6">
                        <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
                            Multiplayer • Real-time • Plug & Play
                        </p>
                        <div className="space-y-4">
                            <h1 className="font-space-grotesk text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                                Bring everyone in. <br /> Play instantly from any device.
                            </h1>
                            <p className="max-w-2xl text-lg text-muted-foreground">
                                EpiConsole turns phones into controllers. Spin up games in seconds, share a QR, and start playing together—no installs, no friction.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button
                                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-[1px] hover:shadow-xl"
                                onClick={() => navigate("/play")}
                            >
                                Start a room
                            </button>
                            <button
                                className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-[1px] hover:border-primary hover:text-primary"
                                onClick={() => navigate("/controller")}
                            >
                                Join as controller
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="rounded-full border border-border/70 bg-card/50 px-3 py-1">No installs</span>
                            <span className="rounded-full border border-border/70 bg-card/50 px-3 py-1">Works on any phone</span>
                            <span className="rounded-full border border-border/70 bg-card/50 px-3 py-1">LAN-friendly</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl backdrop-blur-lg">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--primary)30%,transparent),transparent_45%),radial-gradient(circle_at_80%_0%,color-mix(in_srgb,var(--accent,var(--secondary))25%,transparent),transparent_45%)]" />
                            <div className="p-8">
                                <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                        Live room
                                    </div>
                                    <div className="rounded-full border border-border/50 px-3 py-1">Game ID: XXXX</div>
                                </div>
                                <div className="aspect-video w-full rounded-2xl border border-border/60 bg-muted/30" />
                                <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                                    <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                                        <div className="text-sm font-semibold text-foreground">Phone controllers</div>
                                        <p className="mt-1 leading-relaxed">Scan & play instantly—no installs needed.</p>
                                    </div>
                                    <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                                        <div className="text-sm font-semibold text-foreground">Real-time sync</div>
                                        <p className="mt-1 leading-relaxed">Low-latency updates across all players.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Features */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-2xl font-semibold text-foreground">Why EpiConsole?</h2>
                        <div className="h-px flex-1 bg-border/50" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Feature title="Instant rooms" description="Create and share a room link or QR in seconds. Everyone joins from their phone—nothing to install." />
                        <Feature title="Any device" description="Works on iOS, Android, laptops—if it has a browser, it can play." />
                        <Feature title="Live multiplayer" description="Real-time networking keeps controllers and screen perfectly in sync." />
                        <Feature title="Plug & play" description="Runs on your LAN for game nights; deployable to the cloud when you need reach." />
                        <Feature title="Extendable" description="Swap in your own games or tweak controllers without touching the backend." />
                        <Feature title="Open & friendly" description="Built with React/Vite + Socket.IO — easy to hack, easy to host." />
                    </div>
                </section>

                {/* CTA */}
                <section
                    className="rounded-3xl border border-border/60 p-10 shadow-xl backdrop-blur"
                    style={{
                        background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 16%, transparent), color-mix(in srgb, var(--accent, var(--secondary)) 14%, transparent), color-mix(in srgb, var(--background) 80%, transparent))'
                    }}
                >
                    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                        <div className="space-y-3">
                            <h3 className="text-2xl font-semibold text-foreground">Ready to host a match?</h3>
                            <p className="text-muted-foreground max-w-xl">Fire up a room, share the QR, and let friends join from their phones. Works great on LAN or cloud.</p>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-[1px] hover:shadow-xl"
                                    onClick={() => navigate("/play")}
                                >
                                    Create a room
                                </button>
                                <button
                                    className="rounded-xl border border-border/70 bg-card/70 px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-[1px] hover:border-primary hover:text-primary"
                                    onClick={() => navigate("/controller")}
                                >
                                    Join as controller
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                                <div className="text-lg font-semibold text-white">QR-first</div>
                                <p className="mt-1 leading-relaxed">One scan to connect controllers.</p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                                <div className="text-lg font-semibold text-white">Low latency</div>
                                <p className="mt-1 leading-relaxed">Built on Socket.IO for real-time play.</p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                                <div className="text-lg font-semibold text-white">Mobile ready</div>
                                <p className="mt-1 leading-relaxed">Works on any modern mobile browser.</p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                                <div className="text-lg font-semibold text-white">LAN-friendly</div>
                                <p className="mt-1 leading-relaxed">Perfect for living room play on your network.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}