import Link from "next/link";
import { ArrowRight, CalendarDays, ShieldCheck, Users } from "lucide-react";

const highlights = [
  {
    title: "Private group coordination",
    description: "Run member-verified groups with invitation flows and role-based access.",
    icon: Users,
  },
  {
    title: "Structured meeting lifecycle",
    description: "Schedule, start, join, leave, and close meetings with attendance tracking.",
    icon: CalendarDays,
  },
  {
    title: "Secure authentication",
    description: "Use email-based accounts with cookie-backed JWT sessions and activation support.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(246,160,68,0.25),_transparent_35%),linear-gradient(135deg,_#fff8ef_0%,_#fffdf8_46%,_#f4efe5_100%)] text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-chart-3/20 bg-white/80 px-4 py-2 text-sm font-medium text-chart-4 shadow-sm">
              Meeting Hub for secure team collaboration
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Organize people, meetings, and follow-up in one calm workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Meeting Hub helps teams move from invitation to live session without juggling separate tools for access, scheduling, and attendance.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-chart-3 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-chart-3/25 transition hover:-translate-y-0.5 hover:bg-chart-4"
              >
                Create account
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white/85 px-6 py-4 text-base font-semibold text-slate-900 transition hover:border-chart-3 hover:text-chart-4"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {highlights.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-chart-2/15 text-chart-4">
                    <Icon size={22} />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-8 h-40 rounded-full bg-chart-2/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-chart-2/10 backdrop-blur">
              <div className="rounded-[1.75rem] bg-slate-950 px-6 py-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Today</p>
                    <h2 className="mt-2 text-2xl font-semibold">Leadership Sync</h2>
                  </div>
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-sm text-emerald-300">
                    Live
                  </span>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/8 p-4">
                    <p className="text-sm text-white/60">Participants</p>
                    <p className="mt-2 text-3xl font-bold">18</p>
                    <p className="mt-1 text-sm text-white/70">Verified members connected</p>
                  </div>
                  <div className="rounded-2xl bg-white/8 p-4">
                    <p className="text-sm text-white/60">Minutes status</p>
                    <p className="mt-2 text-3xl font-bold">Ready</p>
                    <p className="mt-1 text-sm text-white/70">Actions and notes tracked</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Upcoming agenda</span>
                    <span>14:30 EAT</span>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex items-center justify-between rounded-xl bg-white/6 px-4 py-3">
                      <span>Budget review</span>
                      <span className="text-white/60">15 min</span>
                    </li>
                    <li className="flex items-center justify-between rounded-xl bg-white/6 px-4 py-3">
                      <span>Membership approvals</span>
                      <span className="text-white/60">10 min</span>
                    </li>
                    <li className="flex items-center justify-between rounded-xl bg-white/6 px-4 py-3">
                      <span>Next sprint kickoff</span>
                      <span className="text-white/60">20 min</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
