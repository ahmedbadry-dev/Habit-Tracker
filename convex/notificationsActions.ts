"use node"

import { action } from './_generated/server'
import { v } from 'convex/values'
import { createPrivateKey, sign } from 'crypto'
import { api } from './_generated/api'

export const sendTestPush = action({
  args: {
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userSettings = await ctx.runQuery(api.settings.getMySettings, {})
    if (!userSettings.pushEnabled) {
      throw new Error('Push notifications are disabled')
    }

    const subs = await ctx.runQuery(api.notifications.getMyPushSubscriptions, {})
    if (subs.length === 0) {
      throw new Error('No push subscriptions found for this user')
    }

    const privateKey = process.env.VAPID_PRIVATE_KEY
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!privateKey || !publicKey) {
      throw new Error(
        'Missing VAPID keys. Set VAPID_PRIVATE_KEY and NEXT_PUBLIC_VAPID_PUBLIC_KEY.'
      )
    }

    const results: Array<{ endpoint: string; ok: boolean; status?: number }> = []

    for (const sub of subs) {
      const jwt = buildVapidJwt({
        endpoint: sub.endpoint,
        publicKey,
        privateKey,
      })

      const res = await fetch(sub.endpoint, {
        method: 'POST',
        headers: {
          TTL: '60',
          Urgency: 'normal',
          Authorization: `vapid t=${jwt}, k=${publicKey}`,
        },
      })

      results.push({
        endpoint: sub.endpoint,
        ok: res.ok,
        status: res.status,
      })
    }

    return {
      sent: results.length,
      success: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
      results,
      preview: {
        title: args.title ?? 'Habit Tracker',
        body: args.body ?? 'This is a test notification from Habit Tracker.',
        url: args.url ?? '/settings',
      },
    }
  },
})

function buildVapidJwt({
  endpoint,
  publicKey,
  privateKey,
}: {
  endpoint: string
  publicKey: string
  privateKey: string
}) {
  const aud = getOrigin(endpoint)
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 12 * 60 * 60

  const header = { typ: 'JWT', alg: 'ES256' }
  const claims = {
    aud,
    exp,
    sub: 'mailto:admin@example.com',
  }

  const encodedHeader = b64urlJson(header)
  const encodedClaims = b64urlJson(claims)
  const signingInput = `${encodedHeader}.${encodedClaims}`

  const keyObject = createPrivateKey({
    key: buildVapidPrivateJwk(privateKey, publicKey),
    format: 'jwk',
  })

  const signature = sign('sha256', Buffer.from(signingInput), {
    key: keyObject,
    dsaEncoding: 'ieee-p1363',
  })

  return `${signingInput}.${b64url(signature)}`
}

function buildVapidPrivateJwk(privateKey: string, publicKey: string) {
  const rawPublic = b64urlToBuf(publicKey)
  if (rawPublic.length !== 65 || rawPublic[0] !== 0x04) {
    throw new Error('Invalid VAPID public key')
  }
  const x = rawPublic.subarray(1, 33)
  const y = rawPublic.subarray(33, 65)

  return {
    kty: 'EC',
    crv: 'P-256',
    x: b64url(x),
    y: b64url(y),
    d: b64url(b64urlToBuf(privateKey)),
  }
}

function getOrigin(endpoint: string) {
  const u = new URL(endpoint)
  return `${u.protocol}//${u.host}`
}

function b64urlJson(obj: unknown) {
  return b64url(Buffer.from(JSON.stringify(obj)))
}

function b64url(data: Buffer | Uint8Array) {
  return Buffer.from(data)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function b64urlToBuf(input: string) {
  const pad = '='.repeat((4 - (input.length % 4)) % 4)
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad
  return Buffer.from(b64, 'base64')
}
