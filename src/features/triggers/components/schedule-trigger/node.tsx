import { NodeProps } from '@xyflow/react'
import { memo, useState } from 'react'
import { ClockIcon } from 'lucide-react'
import { BaseTriggerNode } from '../base-trigger-node'
import { ScheduleTriggerDialog } from './dialog'
import { useNodeStatus } from '@/features/executions/hooks/use-node-status'
import { fetchScheduleTriggerRealtimeToken } from './actions'
import { SCHEDULE_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/schedule-trigger'
import { formatScheduleSummary, type ScheduleConfig } from './schedule'
import { useReactFlow } from '@xyflow/react'

// eslint-disable-next-line react/display-name
export const ScheduleTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { setNodes } = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: SCHEDULE_TRIGGER_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchScheduleTriggerRealtimeToken,
  })

  const handleOpenSettings = () => setDialogOpen(true)

  const handleSubmit = (values: ScheduleConfig) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? { ...node, data: { ...node.data, ...values } }
          : node,
      ),
    )
  }

  const config = props.data as Partial<ScheduleConfig>
  const description = config.frequency
    ? formatScheduleSummary(config as ScheduleConfig)
    : 'Not configured'

  return (
    <>
      <ScheduleTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={config}
      />
      <BaseTriggerNode
        {...props}
        icon={ClockIcon}
        name="Schedule"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})
