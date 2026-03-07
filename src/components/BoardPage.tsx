'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AddTopicModal } from '@/components/AddTopicModal';
import { TopicCard } from '@/components/TopicCard';
import { formatBoardDate, formatDayName } from '@/lib/date';
import { topicStore } from '@/lib/topicStore';
import { useTopicBoard } from '@/lib/useTopicBoard';

export function BoardPage() {
  const today = topicStore.todayDate();
  const [showDone, setShowDone] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { topics, createTopic, updateTopic } = useTopicBoard({ date: today });

  const filtered = useMemo(() => topics.filter((topic) => (showDone ? true : !topic.done)), [topics, showDone]);
  const discuss = filtered.filter((topic) => topic.category === 'DISCUSS');
  const read = filtered.filter((topic) => topic.category === 'READ');

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 sm:p-8">
      <header className="rounded-2xl bg-board-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-board-muted">Vandaag · {formatDayName(today)}</p>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{formatBoardDate(today)}</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => setModalOpen(true)} className="rounded-xl bg-board-accent px-6 py-3 text-lg font-bold text-white">
              + Topic
            </button>
            <Link href="/history" className="rounded-xl bg-slate-900 px-6 py-3 text-lg font-bold text-white">
              History
            </Link>
            <button
              onClick={() => setShowDone((value) => !value)}
              className="rounded-xl bg-slate-100 px-6 py-3 text-lg font-bold text-slate-800"
            >
              {showDone ? 'Verberg gedaan' : 'Toon gedaan'}
            </button>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl bg-slate-50 p-4 sm:p-5">
          <h2 className="text-2xl font-bold text-slate-900">Te bespreken ({discuss.length})</h2>
          {discuss.length === 0 ? <p className="rounded-lg bg-white p-4 text-board-muted">Geen topics in deze kolom.</p> : null}
          {discuss.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onToggleDone={(id, done) => updateTopic(id, { done })}
              onTogglePinned={(id, pinned) => updateTopic(id, { pinned })}
            />
          ))}
        </div>

        <div className="space-y-3 rounded-2xl bg-slate-50 p-4 sm:p-5">
          <h2 className="text-2xl font-bold text-slate-900">Te lezen ({read.length})</h2>
          {read.length === 0 ? <p className="rounded-lg bg-white p-4 text-board-muted">Geen topics in deze kolom.</p> : null}
          {read.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onToggleDone={(id, done) => updateTopic(id, { done })}
              onTogglePinned={(id, pinned) => updateTopic(id, { pinned })}
            />
          ))}
        </div>
      </section>

      <AddTopicModal
        open={modalOpen}
        defaultDate={today}
        onClose={() => setModalOpen(false)}
        onSubmit={(payload) => createTopic(payload)}
      />
    </main>
  );
}
