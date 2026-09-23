import { NodeProps } from '@xyflow/react'
import { WebhookIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { BaseTriggerNode } from '../base-trigger-node'
import { WebhookTriggerDialog } from './dialog'
import { useNodeStatus } from '@/features/executions/hooks/use-node-status'
import { fetchWebhookTriggerRealtimeToken } from './actions'
import { WEBHOOK_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/webhook-trigger'

export const WebhookTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: WEBHOOK_TRIGGER_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchWebhookTriggerRealtimeToken,
  })

  const handleOpenSettings = () => setDialogOpen(true)

  return (
    <>
      <WebhookTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nodeId={props.id}
      />
      <BaseTriggerNode
        {...props}
        icon={WebhookIcon}
        name='Webhook'
        description='When an HTTP request is received'
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})

WebhookTriggerNode.displayName = 'WebhookTriggerNode'
