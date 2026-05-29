import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'

export const subscriptionQueryKey = ['subscription'] as const

export const useSubscription = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  const query = useQuery({
    queryKey: [...subscriptionQueryKey, session?.user.id],
    enabled: !!session?.user.id,
    queryFn: async () => {
      const { data, error } = await authClient.customer.state()

      if (error) {
        throw new Error(error.message ?? 'Failed to fetch subscription state')
      }

      return data
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: 'always',
  })

  return {
    ...query,
    isSessionPending,
  }
}

export const useHasActiveSubscription = () => {
  const queryClient = useQueryClient()
  const {
    data: customerState,
    isLoading,
    isSessionPending,
    ...rest
  } = useSubscription()

  const hasActiveSubscription =
    (customerState?.activeSubscriptions?.length ?? 0) > 0

  const invalidateSubscription = () =>
    queryClient.invalidateQueries({ queryKey: subscriptionQueryKey })

  return {
    hasActiveSubscription,
    subscription: customerState?.activeSubscriptions?.[0],
    isLoading: isLoading || isSessionPending,
    invalidateSubscription,
    ...rest,
  }
}
