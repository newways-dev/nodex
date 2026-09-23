'use client'

import { CopyIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  nodeId: string
}

const variables = [
  { token: '{{webhook.body}}', description: 'Request body (JSON is parsed)' },
  { token: '{{json webhook.body}}', description: 'Request body as a JSON string' },
  { token: '{{webhook.body.email}}', description: 'A field inside a JSON body' },
  { token: '{{webhook.query.id}}', description: 'A query string parameter' },
  { token: '{{webhook.headers.x-source}}', description: 'A request header' },
  { token: '{{webhook.method}}', description: 'HTTP method of the request' },
]

const copy = async (text: string, message: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(message)
  } catch {
    toast.error('Failed to copy')
  }
}

export const WebhookTriggerDialog = ({ open, onOpenChange, nodeId }: Props) => {
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
  }, [])

  const webhookUrl = `${origin}/api/webhooks/generic/${nodeId}`
  const curl = `curl -X POST "${webhookUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"email":"jane@example.com"}'`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Webhook Trigger</DialogTitle>
          <DialogDescription>
            Send an HTTP request to this URL from any service or script to start
            the workflow.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='webhook-url'>Webhook URL</Label>
            <div className='flex gap-2'>
              <Input
                id='webhook-url'
                value={webhookUrl}
                readOnly
                className='font-mono text-sm'
              />
              <Button
                type='button'
                size='icon'
                variant='outline'
                aria-label='Copy webhook URL'
                onClick={() => copy(webhookUrl, 'Webhook URL copied')}
              >
                <CopyIcon className='size-4' />
              </Button>
            </div>
            <p className='text-xs text-muted-foreground'>
              Accepts POST, PUT and PATCH. Save the workflow first: the URL only
              works once this node has been saved. Anyone with the URL can
              trigger the workflow, so keep it private.
            </p>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>Try it</Label>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                onClick={() => copy(curl, 'Command copied')}
              >
                <CopyIcon className='size-3.5' />
                Copy
              </Button>
            </div>
            <pre className='overflow-x-auto rounded-lg bg-muted p-3 text-xs'>
              <code>{curl}</code>
            </pre>
          </div>

          <div className='rounded-lg bg-muted p-4 space-y-2'>
            <h4 className='font-medium text-sm'>Available variables</h4>
            <ul className='text-sm text-muted-foreground space-y-1'>
              {variables.map((variable) => (
                <li key={variable.token}>
                  <code className='bg-background px-1 py-0.5 rounded'>
                    {variable.token}
                  </code>{' '}
                  - {variable.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
