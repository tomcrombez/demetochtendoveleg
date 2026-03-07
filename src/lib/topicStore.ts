export type TopicCategory = 'DISCUSS' | 'READ';

export interface Topic {
  id: string;
  date: string;
  category: TopicCategory;
  title: string;
  details?: string;
  tags: string[];
  pinned: boolean;
  done: boolean;
  createdAt: string;
  createdBy: string;
}

export interface TopicFilters {
  query?: string;
  date?: string;
  from?: string;
  to?: string;
  category?: TopicCategory | 'ALL';
  status?: 'ALL' | 'OPEN' | 'DONE';
}

const BRUSSELS_TZ = 'Europe/Brussels';

const now = new Date();

function toBrusselsDateString(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BRUSSELS_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function dayOffset(days: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return toBrusselsDateString(date);
}

const seedTopics: Topic[] = [
  {
    id: 't1',
    date: dayOffset(0),
    category: 'DISCUSS',
    title: 'Planning schoolfeest route',
    details: 'Afstemmen met sportzaal en vrijwilligers.',
    tags: ['event', 'logistiek'],
    pinned: true,
    done: false,
    createdAt: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
    createdBy: 'Directie',
  },
  {
    id: 't2',
    date: dayOffset(0),
    category: 'READ',
    title: 'Nieuwe GDPR richtlijn samenvatting',
    details: 'Belangrijk voor leerlinggegevens en foto-toestemming.',
    tags: ['beleid', 'privacy'],
    pinned: false,
    done: false,
    createdAt: new Date(now.getTime() - 1000 * 60 * 95).toISOString(),
    createdBy: 'ICT-coördinator',
  },
  {
    id: 't3',
    date: dayOffset(0),
    category: 'DISCUSS',
    title: 'Klasverdeling vervanging vrijdag',
    tags: ['personeel'],
    pinned: false,
    done: true,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
    createdBy: 'Secretariaat',
  },
  {
    id: 't4',
    date: dayOffset(-1),
    category: 'READ',
    title: 'Nieuwsbrief maart review',
    tags: ['communicatie'],
    pinned: true,
    done: true,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 30).toISOString(),
    createdBy: 'Communicatie',
  },
  {
    id: 't5',
    date: dayOffset(-3),
    category: 'DISCUSS',
    title: 'Resultaten ouderbevraging',
    details: '5 min update in teammoment.',
    tags: ['ouders', 'kwaliteit'],
    pinned: false,
    done: false,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 70).toISOString(),
    createdBy: 'Zorgteam',
  },
  {
    id: 't6',
    date: dayOffset(-10),
    category: 'READ',
    title: 'Checklist brandveiligheid',
    tags: ['veiligheid'],
    pinned: false,
    done: true,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 250).toISOString(),
    createdBy: 'Preventieadviseur',
  },
];

let topicsDb: Topic[] = [...seedTopics];

export const topicStore = {
  todayDate(): string {
    return toBrusselsDateString(new Date());
  },

  list(filters: TopicFilters = {}): Topic[] {
    const query = filters.query?.trim().toLowerCase();

    const filtered = topicsDb.filter((topic) => {
      if (filters.date && topic.date !== filters.date) return false;
      if (filters.from && topic.date < filters.from) return false;
      if (filters.to && topic.date > filters.to) return false;
      if (filters.category && filters.category !== 'ALL' && topic.category !== filters.category) return false;
      if (filters.status === 'DONE' && !topic.done) return false;
      if (filters.status === 'OPEN' && topic.done) return false;
      if (
        query &&
        ![topic.title, topic.details ?? '', topic.tags.join(' '), topic.createdBy].join(' ').toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.createdAt.localeCompare(b.createdAt);
    });
  },

  create(input: Omit<Topic, 'id' | 'createdAt' | 'done' | 'createdBy'>): Topic {
    const topic: Topic = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      done: false,
      createdBy: 'Teamlid',
      ...input,
      tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    };

    topicsDb = [topic, ...topicsDb];
    return topic;
  },

  update(id: string, patch: Partial<Omit<Topic, 'id' | 'createdAt'>>): Topic | null {
    let updated: Topic | null = null;

    topicsDb = topicsDb.map((topic) => {
      if (topic.id !== id) return topic;
      updated = {
        ...topic,
        ...patch,
        tags: patch.tags ? patch.tags.map((tag) => tag.trim()).filter(Boolean) : topic.tags,
      };
      return updated;
    });

    return updated;
  },

  delete(id: string): boolean {
    const before = topicsDb.length;
    topicsDb = topicsDb.filter((topic) => topic.id !== id);
    return before !== topicsDb.length;
  },
};
