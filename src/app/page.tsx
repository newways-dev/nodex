import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default async function WelcomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/workflows')

  return (
    <main className='relative flex min-h-svh flex-col overflow-hidden bg-neutral-950 text-white'>
      <div
        className='absolute inset-0 bg-cover bg-center opacity-60'
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      />
      <div className='absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/10' />
      <div
        className='absolute inset-0'
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 30%, transparent 70%)',
        }}
      />

      <div className='relative flex flex-1 flex-col'>
        <header className='flex items-center gap-2 px-6 py-6 sm:px-10'>
          <Image
            src='/logos/nodex-logo.png'
            alt='Nodex'
            width={24}
            height={24}
          />
          <span className='text-sm font-medium tracking-tight'>Nodex</span>
        </header>

        <div className='flex flex-1 flex-col items-center justify-center px-6 text-center'>
          <h1 className='max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl'>
            Connect your tools. Automate everything.
          </h1>
          <p className='mt-4 max-w-md text-balance text-neutral-300'>
            Build automations on a visual canvas — trigger workflows from Stripe
            or Google Forms, call Anthropic, OpenAI, or Gemini, and post to
            Slack or Discord. Every run tracked in the background.
          </p>

          <div className='mt-8 flex items-center gap-3'>
            <Button
              asChild
              size='lg'
              variant='outline'
              className='border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white'
            >
              <Link href='/login'>Log in</Link>
            </Button>
            <Button
              asChild
              size='lg'
              className='bg-white text-neutral-950 hover:bg-white/90'
            >
              <Link href='/signup'>Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
