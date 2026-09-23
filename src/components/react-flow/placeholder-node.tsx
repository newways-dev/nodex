'use client'

import { forwardRef, type ReactNode } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { PlusIcon } from 'lucide-react'

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode
  onClick?: () => void
}

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
  ({ onClick }, ref) => {
    return (
      <div
        ref={ref}
        role='button'
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') onClick?.()
        }}
        className='group flex w-56 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-card/60 px-4 py-6 text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-primary'
      >
        <span className='flex size-9 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/15'>
          <PlusIcon className='size-4' />
        </span>
        <span className='text-xs font-medium'>Add the first step</span>
        <Handle
          type='target'
          style={{ visibility: 'hidden' }}
          position={Position.Top}
          isConnectable={false}
        />
        <Handle
          type='source'
          style={{ visibility: 'hidden' }}
          position={Position.Bottom}
          isConnectable={false}
        />
      </div>
    )
  },
)

PlaceholderNode.displayName = 'PlaceholderNode'
