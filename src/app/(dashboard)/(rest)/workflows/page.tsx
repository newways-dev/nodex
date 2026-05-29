import {
  WorkflowsContainer,
  WorkflowsError,
  WorkflowsList,
  WorkflowsLoading,
} from '@/features/workflows/components/workflows'
import { workflowsParamsLoader } from '@/features/workflows/server/params-loader'
import { prefetchWorkflows } from '@/features/workflows/server/prefetch'
import { ErrorBoundary } from 'react-error-boundary'
import type { SearchParams } from 'nuqs/server'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import { Suspense } from 'react'

type Props = {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  await requireAuth()

  const params = await workflowsParamsLoader(searchParams)
  prefetchWorkflows(params)

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError />}>
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  )
}

export default Page
