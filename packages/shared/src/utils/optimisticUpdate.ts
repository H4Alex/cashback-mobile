import type { QueryClient, QueryKey } from '@tanstack/react-query'

/**
 * Configuration object returned by `createOptimisticConfig`.
 * Spread this into a `useMutation` options object to enable
 * snapshot/rollback optimistic updates for the given query key.
 *
 * @template TData - The shape of the cached query data
 * @template TVariable - The variable passed to the mutation function
 */
export interface OptimisticConfig<TData, TVariable> {
  onMutate: (variable: TVariable) => Promise<{ previousData: TData | undefined }>
  onError: (error: unknown, variable: TVariable, context: { previousData: TData | undefined } | undefined) => void
  onSettled: () => Promise<void>
}

/**
 * Creates React Query `useMutation` callbacks that implement the
 * snapshot/rollback optimistic-update pattern.
 *
 * 1. **onMutate** — cancels in-flight queries for the key, snapshots
 *    the current cache, and applies the optimistic update via `updater`.
 * 2. **onError** — rolls the cache back to the snapshot on failure.
 * 3. **onSettled** — invalidates the query so fresh server data is fetched
 *    regardless of success or failure.
 *
 * @param queryClient - The React Query client instance
 * @param queryKey - The query key whose cache will be optimistically updated
 * @param updater - A pure function that receives the current cached data and
 *   the mutation variable, and returns the new optimistic data.
 *   If the cache is empty (`undefined`), the updater is still called so it
 *   can decide on a sensible default (e.g. `[newItem]`).
 *
 * @returns An object with `onMutate`, `onError`, and `onSettled` callbacks
 *   ready to be spread into `useMutation` options.
 *
 * @example
 * ```ts
 * const queryClient = useQueryClient()
 *
 * const optimistic = createOptimisticConfig(
 *   queryClient,
 *   ['campaigns'],
 *   (old, newItem) => [...(old ?? []), newItem]
 * )
 *
 * const mutation = useMutation({
 *   mutationFn: (campaign: Campaign) => campaignApi.create(campaign),
 *   ...optimistic,
 * })
 * ```
 *
 * @example With object data
 * ```ts
 * const optimistic = createOptimisticConfig(
 *   queryClient,
 *   ['dashboard', 'stats'],
 *   (old, patch) => ({ ...old, ...patch })
 * )
 * ```
 */
export function createOptimisticConfig<TData, TVariable>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  updater: (oldData: TData | undefined, variable: TVariable) => TData
): OptimisticConfig<TData, TVariable> {
  return {
    onMutate: async (variable: TVariable) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey)

      // Optimistically update the cache
      queryClient.setQueryData<TData>(queryKey, (old) => updater(old, variable))

      // Return the snapshot so we can rollback on error
      return { previousData }
    },

    onError: (_error: unknown, _variable: TVariable, context: { previousData: TData | undefined } | undefined) => {
      // Rollback to the previous value on failure
      if (context?.previousData !== undefined) {
        queryClient.setQueryData<TData>(queryKey, context.previousData)
      }
    },

    onSettled: async () => {
      // Always refetch after error or success to ensure cache is in sync
      await queryClient.invalidateQueries({ queryKey })
    },
  }
}

/**
 * Convenience wrapper around `createOptimisticConfig` for the common
 * "append item to list" pattern.
 *
 * @example
 * ```ts
 * const optimistic = createOptimisticAppend<Campaign>(queryClient, ['campaigns'])
 *
 * const mutation = useMutation({
 *   mutationFn: campaignApi.create,
 *   ...optimistic,
 * })
 * ```
 */
export function createOptimisticAppend<TItem>(
  queryClient: QueryClient,
  queryKey: QueryKey
): OptimisticConfig<TItem[], TItem> {
  return createOptimisticConfig<TItem[], TItem>(queryClient, queryKey, (old, newItem) => [...(old ?? []), newItem])
}

/**
 * Convenience wrapper around `createOptimisticConfig` for the common
 * "update item in list by id" pattern.
 *
 * @param getId - Function to extract the identifier from an item (defaults to `item.id`)
 *
 * @example
 * ```ts
 * const optimistic = createOptimisticUpdate<Campaign>(queryClient, ['campaigns'])
 *
 * const mutation = useMutation({
 *   mutationFn: (campaign) => campaignApi.update(campaign.id, campaign),
 *   ...optimistic,
 * })
 * ```
 */
export function createOptimisticListUpdate<TItem extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  getId?: (item: TItem) => string | number
): OptimisticConfig<TItem[], TItem> {
  const extractId = getId ?? ((item: TItem) => item.id)

  return createOptimisticConfig<TItem[], TItem>(queryClient, queryKey, (old, updatedItem) => {
    if (!old) return [updatedItem]
    return old.map((item) => (extractId(item) === extractId(updatedItem) ? updatedItem : item))
  })
}

/**
 * Convenience wrapper around `createOptimisticConfig` for the common
 * "remove item from list by id" pattern.
 *
 * @example
 * ```ts
 * const optimistic = createOptimisticRemove<Campaign>(queryClient, ['campaigns'])
 *
 * const mutation = useMutation({
 *   mutationFn: (id: string) => campaignApi.delete(id),
 *   ...optimistic,
 * })
 * ```
 */
export function createOptimisticRemove<TItem extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  getId?: (item: TItem) => string | number
): OptimisticConfig<TItem[], string | number> {
  const extractId = getId ?? ((item: TItem) => item.id)

  return createOptimisticConfig<TItem[], string | number>(queryClient, queryKey, (old, removedId) =>
    (old ?? []).filter((item) => extractId(item) !== removedId)
  )
}
