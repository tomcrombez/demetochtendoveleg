'use client';

import { useMemo, useReducer } from 'react';
import { topicStore, type Topic, type TopicCategory, type TopicFilters } from '@/lib/topicStore';

interface State {
  topics: Topic[];
}

type Action =
  | { type: 'refresh'; payload?: TopicFilters }
  | { type: 'create'; payload: Omit<Topic, 'id' | 'createdAt' | 'done' | 'createdBy'> }
  | { type: 'update'; id: string; patch: Partial<Omit<Topic, 'id' | 'createdAt'>> }
  | { type: 'delete'; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'refresh': {
      return { topics: topicStore.list(action.payload) };
    }
    case 'create': {
      topicStore.create(action.payload);
      return { topics: topicStore.list() };
    }
    case 'update': {
      topicStore.update(action.id, action.patch);
      return { topics: topicStore.list() };
    }
    case 'delete': {
      topicStore.delete(action.id);
      return { topics: topicStore.list() };
    }
    default:
      return state;
  }
}

export function useTopicBoard(initialFilters?: TopicFilters) {
  const [state, dispatch] = useReducer(reducer, { topics: topicStore.list(initialFilters) });

  return {
    topics: state.topics,
    refresh: (filters?: TopicFilters) => dispatch({ type: 'refresh', payload: filters }),
    createTopic: (payload: Omit<Topic, 'id' | 'createdAt' | 'done' | 'createdBy'>) =>
      dispatch({ type: 'create', payload }),
    updateTopic: (id: string, patch: Partial<Omit<Topic, 'id' | 'createdAt'>>) => dispatch({ type: 'update', id, patch }),
    deleteTopic: (id: string) => dispatch({ type: 'delete', id }),
    groupedByDate: useMemo(() => {
      return state.topics.reduce<Record<string, Topic[]>>((acc, topic) => {
        if (!acc[topic.date]) acc[topic.date] = [];
        acc[topic.date].push(topic);
        return acc;
      }, {});
    }, [state.topics]),
    countsByCategory: useMemo(() => {
      return state.topics.reduce<Record<TopicCategory, number>>(
        (acc, topic) => {
          acc[topic.category] += 1;
          return acc;
        },
        { DISCUSS: 0, READ: 0 },
      );
    }, [state.topics]),
  };
}
