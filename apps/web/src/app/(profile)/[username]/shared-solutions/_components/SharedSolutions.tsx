'use client';
import { useState } from 'react';
import {
  SharedSolutionCard,
  type SharedSolutionCardProps,
} from '../../_components/shared-solution-card';
import {
  DIFFICULTY_COLOR_MAP,
  FilterBar,
  type FilterOptions,
} from '../../completed/_components/filter-bar';
import { cn } from '@repo/ui/cn';

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export function SharedSolutions(props: {
  solutions: (SharedSolutionCardProps['solution'] & { id: number; challenge: { slug: string } })[];
  className?: string;
  isOwnProfile: boolean;
  username: string;
}) {
  const [filter, setFilter] = useState<FilterOptions>('ALL');
  /*TODO: Can be optimized by sending the data, pregrouped from the backend*/
  const filteredChallenges = props.solutions.filter((c) => {
    if (filter === 'ALL') return true;
    return c.challenge.difficulty === filter;
  });
  return (
    <div className={cn('flex flex-col justify-center space-y-8', props.className)}>
      <FilterBar filter={filter} setFilter={setFilter} />

      {filteredChallenges.length === 0 ? (
        <Alert className="mx-auto w-fit md:px-8">
          <AlertTitle className="text-center leading-normal">
            <span>{props.isOwnProfile ? "You haven't" : `@${props.username} hasn't`}</span>{' '}
            completed any{' '}
            <span
              className="lowercase"
              style={{
                color: `hsl(${DIFFICULTY_COLOR_MAP[filter]})`,
              }}
            >
              {filter}
            </span>{' '}
            challenges yet
          </AlertTitle>
          {props.isOwnProfile ? (
            <AlertDescription className="flex justify-center">
              <Button variant="link" size="sm">
                <Link href={`/explore/${filter.toLowerCase()}`}>
                  Get started with your first <span className="lowercase">{filter}</span> challenge
                </Link>
              </Button>
            </AlertDescription>
          ) : null}
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((s) => (
          <Link
            href={`/challenge/${encodeURIComponent(s.challenge.slug)}/solutions/${s.id}`}
            key={s.challenge.name}
          >
            <SharedSolutionCard solution={s} />
          </Link>
        ))}
      </div>
    </div>
  );
}