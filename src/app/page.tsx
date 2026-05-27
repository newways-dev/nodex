'use client'

import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'
import { toast } from 'sonner'

const Page = () => {
  const trpc = useTRPC()
  const { data } = useQuery(trpc.getWorkflows.queryOptions())

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success('Job queued')
      },
      onError: (err) => {
        toast.error(err.message)
      },
    }),
  )

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected server component
      <div>{JSON.stringify(data, null, 2)}</div>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create workflow
      </Button>
    </div>
  )
}

export default Page
