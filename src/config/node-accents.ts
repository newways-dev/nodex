import { NodeType } from '@/generated/prisma'

type NodeAccent = {
  label: string
  hue: number
}

const trigger: NodeAccent = { label: 'Trigger', hue: 255 }
const request: NodeAccent = { label: 'Request', hue: 195 }
const ai: NodeAccent = { label: 'AI', hue: 305 }
const message: NodeAccent = { label: 'Message', hue: 65 }
const fallback: NodeAccent = { label: 'Step', hue: 260 }

const accents: Partial<Record<NodeType, NodeAccent>> = {
  [NodeType.MANUAL_TRIGGER]: trigger,
  [NodeType.GOOGLE_FORM_TRIGGER]: trigger,
  [NodeType.STRIPE_TRIGGER]: trigger,
  [NodeType.SCHEDULE_TRIGGER]: trigger,
  [NodeType.HTTP_REQUEST]: request,
  [NodeType.GEMINI]: ai,
  [NodeType.OPENAI]: ai,
  [NodeType.ANTHROPIC]: ai,
  [NodeType.DISCORD]: message,
  [NodeType.SLACK]: message,
}

export function getNodeAccent(type?: string): NodeAccent {
  return accents[type as NodeType] ?? fallback
}

export function accentColor(type?: string, alpha = 1) {
  const { hue } = getNodeAccent(type)
  return `oklch(0.72 0.15 ${hue} / ${alpha})`
}

export function accentSolid(type?: string) {
  const { hue } = getNodeAccent(type)
  return `hsl(${hue} 72% 60%)`
}
