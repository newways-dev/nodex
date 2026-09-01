import { betterAuth } from 'better-auth'
import { polar, checkout, portal } from '@polar-sh/better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { polarClient } from './polar'
import prisma from '@/lib/db'

export const auth = betterAuth({
  trustedOrigins: [
    'http://localhost:3000',
    'https://grader-sapling-tutu.ngrok-free.dev',
  ],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: 'fbb3ddf7-5700-49bb-b79b-67c50c79421c',
              slug: 'pro', // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
})
