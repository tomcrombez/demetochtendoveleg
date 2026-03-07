'use client';

import { useState } from 'react';
import type { TopicCategory } from '@/lib/topicStore';

interface AddTopicModalProps {
  open: boolean;
  defaultDate: string;
  onClose: () => void;
  onSubmit: (payload: {
    date: string;
    category: TopicCategory;
    title: string;
    details?: string;
    tags: string[];
    pinned: boolean;
  }) => void;
}

export function AddTopicModal({ open, defaultDate, onClose, onSubmit }: AddTopicModalProps) {
  const [category, setCategory] = useState<TopicCategory>('DISCUSS');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [pinned, setPinned] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-slate-900">Nieuw topic toevoegen</h2>

        <form
          className="mt-4 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;

            onSubmit({
              date,
              category,
              title: title.trim(),
              details: details.trim() || undefined,
              tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
              pinned,
            });

            setTitle('');
            setDetails('');
            setTags('');
            setCategory('DISCUSS');
            setDate(defaultDate);
            setPinned(false);
            onClose();
          }}
        >
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">Categorie</legend>
            <div className="flex gap-3">
              {(['DISCUSS', 'READ'] as const).map((option) => (
                <label key={option} className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2">
                  <input
                    type="radio"
                    name="category"
                    value={option}
                    checked={category === option}
                    onChange={() => setCategory(option)}
                  />
                  {option === 'DISCUSS' ? 'Te bespreken' : 'Te lezen'}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Titel *</span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="Bijv. planning uitstap 5e leerjaar"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Details (optioneel)</span>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Tags (comma separated)</span>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="team, planning, administratie"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Datum</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>

            <label className="flex items-center gap-2 pt-6 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)} className="h-5 w-5" />
              Pinned topic
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700">
              Annuleren
            </button>
            <button type="submit" className="rounded-xl bg-board-accent px-5 py-3 font-semibold text-white">
              Toevoegen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
