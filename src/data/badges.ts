import { Award, Mic, Users, Star, Globe } from 'lucide-react';
import React from 'react';

export type BadgeId = 'ROCK_STAR' | 'DUEL_MASTER' | 'EARLY_BIRD' | 'PERFECTIONIST' | 'POLYGLOT';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  criteria: {
    type: 'song_count' | 'duel_wins' | 'first_session' | 'perfect_score' | 'language_count';
    value: number;
    genre?: string; // Used for ROCK_STAR
  };
}

export const allBadges: Badge[] = [
  {
    id: 'EARLY_BIRD',
    name: 'Early Bird',
    description: 'Completed your very first vocal session.',
    icon: Star,
    color: 'text-yellow-400',
    criteria: { type: 'first_session', value: 1 },
  },
  {
    id: 'ROCK_STAR',
    name: 'Rock Star',
    description: 'Completed 5 songs in the Rock Classics genre.',
    icon: Mic,
    color: 'text-red-500',
    criteria: { type: 'song_count', value: 5, genre: 'Rock Classics' },
  },
  {
    id: 'DUEL_MASTER',
    name: 'Duel Master',
    description: 'Won 10 local duels against the AI opponent.',
    icon: Users,
    color: 'text-primary',
    criteria: { type: 'duel_wins', value: 10 },
  },
  {
    id: 'PERFECTIONIST',
    name: 'Perfectionist',
    description: 'Achieved a perfect 100% pitch accuracy score in a session.',
    icon: Award,
    color: 'text-accent',
    criteria: { type: 'perfect_score', value: 100 },
  },
  {
    id: 'POLYGLOT',
    name: 'Polyglot',
    description: 'Sang songs in two different languages (Mocked via song IDs).',
    icon: Globe,
    color: 'text-green-400',
    criteria: { type: 'language_count', value: 2 },
  },
];