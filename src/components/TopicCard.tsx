'use client';

import { useState } from 'react';
import type { Topic } from '@/lib/topicStore';

interface TopicCardProps {
  topic: Topic;
  onToggleDone: (id: string, next: boolean) => void;
  onTogglePinned: (id: string, next: boolean) => void;
}

export function TopicCard({ topic, onToggleDone, onTogglePinned }: TopicCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <article className="rounded-xl bg-board-card p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={topic.done}
          onChange={(event) => onToggleDone(topic.id, event.target.checked)}
          className="mt-1 h-6 w-6 rounded border-slate-300"
          aria-label={`Markeer ${topic.title} als gedaan`}
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-lg font-semibold ${topic.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
              {topic.title}
            </h3>
            {topic.pinned && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">📌 Pinned</span>}
          </div>

          <p className="mt-1 text-sm text-board-muted">aangemaakt door {topic.createdBy}</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {topic.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                #{tag}
              </span>
            ))}
          </div>

          {topic.details && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="text-sm font-semibold text-board-accent"
              >
                {open ? 'Details verbergen' : 'Details tonen'}
              </button>
              {open && <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{topic.details}</p>}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onTogglePinned(topic.id, !topic.pinned)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            topic.pinned ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {topic.pinned ? 'Unpin' : 'Pin'}
        </button>
      </div>
    </article>
  );
}
