import { forwardRef } from 'react'
import { Handle, type HandleProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

export type BaseHandleProps = HandleProps

export const BaseHandle = forwardRef<HTMLDivElement, BaseHandleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Handle
        ref={ref}
        {...props}
        className={cn(
          '!size-3.5 !rounded-full !border-2 !border-card !bg-[var(--accent,var(--muted-foreground))] transition-transform duration-150 hover:!scale-125',
          className,
        )}
      >
        {children}
      </Handle>
    )
  },
)

BaseHandle.displayName = 'BaseHandle'
