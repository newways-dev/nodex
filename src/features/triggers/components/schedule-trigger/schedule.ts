export type ScheduleFrequency = 'interval' | 'daily' | 'weekly'

export type ScheduleConfig = {
  frequency: ScheduleFrequency
  intervalValue?: number
  intervalUnit?: 'minutes' | 'hours'
  timeOfDay?: string
  daysOfWeek?: number[]
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function computeNextRun(config: ScheduleConfig, from: Date): Date {
  if (config.frequency === 'interval') {
    const unitMs = config.intervalUnit === 'hours' ? 3_600_000 : 60_000
    const stepMs = Math.max(1, config.intervalValue ?? 5) * unitMs
    return new Date(from.getTime() + stepMs)
  }

  const [hours, minutes] = (config.timeOfDay ?? '09:00')
    .split(':')
    .map(Number)

  if (config.frequency === 'daily') {
    const next = new Date(
      Date.UTC(
        from.getUTCFullYear(),
        from.getUTCMonth(),
        from.getUTCDate(),
        hours,
        minutes,
        0,
        0,
      ),
    )
    if (next <= from) {
      next.setUTCDate(next.getUTCDate() + 1)
    }
    return next
  }

  const days = config.daysOfWeek?.length ? config.daysOfWeek : [1]
  for (let i = 0; i <= 7; i++) {
    const candidate = new Date(
      Date.UTC(
        from.getUTCFullYear(),
        from.getUTCMonth(),
        from.getUTCDate() + i,
        hours,
        minutes,
        0,
        0,
      ),
    )
    if (candidate > from && days.includes(candidate.getUTCDay())) {
      return candidate
    }
  }
  return new Date(from.getTime() + 7 * 86_400_000)
}

export function formatScheduleSummary(config: ScheduleConfig): string {
  if (config.frequency === 'interval') {
    const value = Math.max(1, config.intervalValue ?? 5)
    const unit = config.intervalUnit === 'hours' ? 'hour' : 'minute'
    return `Every ${value} ${unit}${value === 1 ? '' : 's'}`
  }

  const time = config.timeOfDay ?? '09:00'

  if (config.frequency === 'daily') {
    return `Daily at ${time} UTC`
  }

  const days = (config.daysOfWeek?.length ? config.daysOfWeek : [1])
    .slice()
    .sort((a, b) => a - b)
    .map((day) => DAY_LABELS[day])
    .join(', ')

  return `${days} at ${time} UTC`
}
