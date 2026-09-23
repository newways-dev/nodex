import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { accentColor, getNodeAccent } from '@/config/node-accents'
import { cn } from '@/lib/utils'
import type { NodeStatus } from './node-status-indicator'

interface NodeCardProps extends HTMLAttributes<HTMLDivElement> {
  type?: string
  icon: LucideIcon | string
  name: string
  description?: string
  status?: NodeStatus
  pill?: boolean
  children?: ReactNode
}

const dotStyles: Record<NodeStatus, string> = {
  initial: 'bg-muted-foreground/30',
  loading: 'bg-sky-500',
  success: 'bg-emerald-500',
  error: 'bg-red-500',
}

const cardStyles: Record<NodeStatus, string> = {
  initial: '',
  loading: 'border-sky-500/60 ring-4 ring-sky-500/15',
  success: 'border-emerald-500/50',
  error: 'border-red-500/60 ring-4 ring-red-500/15',
}

const StatusDot = ({ status }: { status: NodeStatus }) => (
  <span className='relative mt-1 flex size-2.5 shrink-0' title={status}>
    {status === 'loading' && (
      <span className='absolute inline-flex size-full animate-ping rounded-full bg-sky-400/70' />
    )}
    <span
      className={cn('relative inline-flex size-2.5 rounded-full', dotStyles[status])}
    />
  </span>
)

export function NodeCard({
  type,
  icon: Icon,
  name,
  description,
  status = 'initial',
  pill,
  children,
  className,
  ...props
}: NodeCardProps) {
  const { label } = getNodeAccent(type)

  return (
    <div
      tabIndex={0}
      data-status={status}
      style={
        {
          '--accent': accentColor(type),
          '--accent-soft': accentColor(type, 0.16),
        } as CSSProperties
      }
      className={cn(
        'node-card relative w-56 rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md',
        pill && 'rounded-l-3xl',
        cardStyles[status],
        className,
      )}
      {...props}
    >
      <span className='absolute inset-y-3 left-0 w-1 rounded-r-full bg-[var(--accent)]' />
      <div className='flex items-start gap-3 py-3 pl-4 pr-3'>
        <span className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)]'>
          {typeof Icon === 'string' ? (
            <Image src={Icon} alt={name} width={20} height={20} />
          ) : (
            <Icon className='size-5 text-[color-mix(in_oklab,var(--accent)_70%,var(--foreground))]' />
          )}
        </span>
        <div className='min-w-0 flex-1'>
          <p className='text-[10px] font-semibold uppercase tracking-wider text-[color-mix(in_oklab,var(--accent)_70%,var(--foreground))]'>
            {label}
          </p>
          <p className='line-clamp-2 text-sm font-semibold leading-tight'>{name}</p>
          {description && (
            <p className='mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground'>
              {description}
            </p>
          )}
        </div>
        <StatusDot status={status} />
      </div>
      {children}
    </div>
  )
}
