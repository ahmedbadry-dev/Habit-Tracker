import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { components } from './_generated/api'
import { DataModel } from './_generated/dataModel'
import { mutation, query } from './_generated/server'
import { betterAuth } from 'better-auth/minimal'
import authConfig from './auth.config'
import { Resend } from 'resend'
import { action } from './_generated/server'

// TODO: Replace sendEmail with Resend/Nodemailer later
if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY')
}
const resend = new Resend(process.env.RESEND_API_KEY)

async function sendEmail(opts: { to: string; subject: string; html: string }) {
  await resend.emails.send({
    from: 'Habit Tracker <onboarding@resend.dev>',
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  })
}

function resolveBaseUrl() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.SITE_URL) return process.env.SITE_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

function normalizeOrigin(value?: string | null) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined

  // Allow plain host from env values and normalize protocol deterministically.
  const candidate =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`

  try {
    return new URL(candidate).origin
  } catch {
    return undefined
  }
}

function parseCsvOrigins(csv?: string) {
  if (!csv) return []
  return csv
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter((origin): origin is string => Boolean(origin))
}

function buildTrustedOrigins(baseURL: string) {
  const origins = [
    normalizeOrigin(baseURL),
    normalizeOrigin(process.env.BETTER_AUTH_URL),
    normalizeOrigin(process.env.SITE_URL),
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL),
    normalizeOrigin(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
    normalizeOrigin(process.env.NEXT_PUBLIC_CONVEX_SITE_URL),
    normalizeOrigin(process.env.NEXT_PUBLIC_CONVEX_URL),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://[::1]:3000',
    ...parseCsvOrigins(process.env.BETTER_AUTH_TRUSTED_ORIGINS),
  ].filter((origin): origin is string => Boolean(origin))

  return [...new Set(origins)]
}

const baseURL = normalizeOrigin(resolveBaseUrl()) ?? 'http://localhost:3000'
const trustedOrigins = buildTrustedOrigins(baseURL)
const ORIGIN_DEBUG = process.env.BETTER_AUTH_ORIGIN_DEBUG !== 'false'

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth)

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  if (ORIGIN_DEBUG) {
    console.log('[better-auth][origin] baseURL:', baseURL)
    console.log('[better-auth][origin] trustedOrigins:', trustedOrigins)
  }

  return betterAuth({
    baseURL,
    trustedOrigins: async (request) => {
      if (ORIGIN_DEBUG) {
        const requestOrigin =
          request?.headers.get('origin') ?? request?.headers.get('referer') ?? 'missing'
        console.log('[better-auth][origin] request origin:', requestOrigin)
      }
      return trustedOrigins
    },
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,

      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: 'Reset your password',
          html: `
      <div style="font-family: sans-serif;">
        <h2>Reset Your Password</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${url}" 
           style="display:inline-block;
                  padding:12px 20px;
                  background:#6366f1;
                  color:white;
                  text-decoration:none;
                  border-radius:8px;">
          Reset Password
        </a>
        <p style="margin-top:16px;font-size:12px;color:#666;">
          If you did not request this, you can ignore this email.
        </p>
      </div>
    `,
        })
      },
    },

    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),
    ],
  })
}

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx)
  },
})

export const testEmail = action({
  args: {},
  handler: async () => {
    const resend = new Resend(process.env.RESEND_API_KEY!)

    const result = await resend.emails.send({
      from: 'Habit Tracker <onboarding@resend.dev>',
      to: 'ra6514201@gmail.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    })

    console.log('RESEND RESPONSE:', result)

    return result
  },
})
