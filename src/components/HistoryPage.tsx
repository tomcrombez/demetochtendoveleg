'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { formatBoardDate } from '@/lib/date';
import { topicStore, type TopicCategory } from '@/lib/topicStore';
import { useTopicBoard } from '@/lib/useTopicBoard';

function presetFrom(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Brussels',
  }).format(date);
}

export function HistoryPage() {
  const today = topicStore.todayDate();
  const [query, setQuery] = useState('');
  const [preset, setPreset] = useState<'7' | '30' | '90' | 'custom'>('30');
  const [from, setFrom] = useState(presetFrom(30));
  const [to, setTo] = useState(today);
  const [category, setCategory] = useState<TopicCategory | 'ALL'>('ALL');
  const [status, setStatus] = useState<'ALL' | 'OPEN' | 'DONE'>('ALL');

  const appliedFrom = preset === 'custom' ? from : presetFrom(Number(preset));

  const { topics, groupedByDate } = useTopicBoard({
    query,
    from: appliedFrom,
    to,
    category,
    status,
  });

  const orderedDates = useMemo(() => Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a)), [groupedByDate]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 sm:p-8">
      <header className="rounded-2xl bg-board-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold text-slate-900">History</h1>
          <Link href="/" className="rounded-xl bg-slate-900 px-5 py-3 text-base font-bold text-white">
            Terug naar vandaag
          </Link>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          <label className="lg:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Zoeken</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Zoek op titel, details, tags of auteur"
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Categorie</span>
            <select value={category} onChange={(event) => setCategory(event.target.value as TopicCategory | 'ALL')} className="w-full rounded-lg border border-slate-200 px-3 py-2">
              <option value="ALL">Alle</option>
              <option value="DISCUSS">Te bespreken</option>
              <option value="READ">Te lezen</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as 'ALL' | 'OPEN' | 'DONE')} className="w-full rounded-lg border border-slate-200 px-3 py-2">
              <option value="ALL">Alle</option>
              <option value="OPEN">Open</option>
              <option value="DONE">Gedaan</option>
            </select>
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">Date range</p>
          <div className="flex flex-wrap gap-2">
            {(['7', '30', '90', 'custom'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPreset(option)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  preset === option ? 'bg-board-accent text-white' : 'bg-white text-slate-700'
                }`}
              >
                {option === 'custom' ? 'Custom' : `${option} dagen`}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-sm font-semibold text-slate-700">Van</span>
              <input
                type="date"
                value={appliedFrom}
                disabled={preset !== 'custom'}
                onChange={(event) => setFrom(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 disabled:bg-slate-100"
              />
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold text-slate-700">Tot</span>
              <input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
        </div>
      </header>

      <section className="mt-6 space-y-5">
        <p className="text-sm text-board-muted">{topics.length} topics gevonden</p>

        {orderedDates.map((date) => {
          const dayTopics = groupedByDate[date];
          const doneCount = dayTopics.filter((topic) => topic.done).length;
          return (
            <div key={date} className="rounded-xl bg-white p-5 shadow-soft">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-slate-900">{formatBoardDate(date)}</h2>
                <p className="text-sm text-board-muted">
                  {dayTopics.length} totaal · {doneCount} gedaan
                </p>
              </div>

              <ul className="space-y-2">
                {dayTopics.map((topic) => (
                  <li key={topic.id} className="rounded-lg border border-slate-100 px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{topic.title}</span>
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs">{topic.category === 'DISCUSS' ? 'Te bespreken' : 'Te lezen'}</span>
                      {topic.pinned && <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700">📌</span>}
                      {topic.done && <span className="rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Gedaan</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </main>
  );
}
