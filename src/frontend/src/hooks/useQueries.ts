import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Reading } from '../backend';

const POLL_INTERVAL = 3000; // Poll every 3 seconds

// Query keys for easy invalidation
export const QUERY_KEYS = {
  readings: {
    all: ['readings', 'all'] as const,
    latest: ['readings', 'latest'] as const,
  },
};

export function useGetAllReadings() {
  const { actor, isFetching } = useActor();

  return useQuery<Reading[]>({
    queryKey: QUERY_KEYS.readings.all,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReadings();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
  });
}

export function useGetLatestReading() {
  const { actor, isFetching } = useActor();

  return useQuery<Reading | null>({
    queryKey: QUERY_KEYS.readings.latest,
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getLatestReading();
      } catch (error) {
        // Return null if no readings available yet
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
  });
}
