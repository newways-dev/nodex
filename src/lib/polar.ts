import { Polar } from '@polar-sh/sdk'

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  // Sandbox vs production is determined by the access token — no separate env var needed.
  server: 'sandbox',
})
