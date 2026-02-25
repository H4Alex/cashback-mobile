import { useQuery } from '@tanstack/react-query'
import dashboardService from '../services/dashboard.service'
import logger from '../utils/logger'

/**
 * Fetch and cache dashboard data using React Query.
 * Data is considered stale after 30 seconds and automatically refetched every 30 seconds.
 *
 * @returns React Query result with `data`, `isLoading`, `isError`, and `refetch`
 * @example
 * const { data, isLoading } = useDashboard()
 * if (isLoading) return <Skeleton />
 * return <DashboardView metrics={data.metricas} />
 */
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getStats().then((r) => r.data),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    meta: {
      onError: (error: unknown) => {
        logger.error('[useDashboard] Failed to fetch dashboard data:', error)
      },
    },
  })
}
