import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { NodeType } from '@/generated/prisma'
import { sendWorkflowExecution } from '@/inngest/utils'
import { MAX_WEBHOOK_BYTES, buildWebhookPayload } from '@/lib/webhook-payload'

type RouteContext = { params: Promise<{ nodeId: string }> }

async function handle(request: NextRequest, { params }: RouteContext) {
  try {
    const { nodeId } = await params

    const node = await prisma.node.findFirst({
      where: { id: nodeId, type: NodeType.WEBHOOK_TRIGGER },
      select: { workflowId: true },
    })

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Webhook not found' },
        { status: 404 },
      )
    }

    const rawBody = await request.text()

    if (Buffer.byteLength(rawBody) > MAX_WEBHOOK_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Payload too large' },
        { status: 413 },
      )
    }

    const webhook = buildWebhookPayload({
      method: request.method,
      url: request.url,
      headers: request.headers,
      rawBody,
    })

    await sendWorkflowExecution({
      workflowId: node.workflowId,
      initialData: { webhook },
    })

    return NextResponse.json({ success: true }, { status: 202 })
  } catch (error) {
    console.error('Generic webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 },
    )
  }
}

export const POST = handle
export const PUT = handle
export const PATCH = handle

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Use POST, PUT or PATCH' },
    { status: 405, headers: { Allow: 'POST, PUT, PATCH' } },
  )
}
