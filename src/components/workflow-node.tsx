'use client'

import { NodeToolbar } from '@xyflow/react'
import { SettingsIcon, TrashIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './ui/button'

interface WorkflowNodeProps {
  children: ReactNode
  showToolbar?: boolean
  onDelete?: () => void
  onSettings?: () => void
}

export function WorkflowNode({
  children,
  showToolbar = true,
  onDelete,
  onSettings,
}: WorkflowNodeProps) {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <div className='flex items-center gap-0.5 rounded-lg border bg-card p-1 shadow-md'>
            <Button
              size='icon'
              variant='ghost'
              className='size-7'
              onClick={onSettings}
              aria-label='Node settings'
            >
              <SettingsIcon className='size-3.5' />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='size-7 hover:text-destructive'
              onClick={onDelete}
              aria-label='Delete node'
            >
              <TrashIcon className='size-3.5' />
            </Button>
          </div>
        </NodeToolbar>
      )}
      {children}
    </>
  )
}
