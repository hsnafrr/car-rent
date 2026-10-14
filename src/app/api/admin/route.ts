/**
 * The only door between the admin dashboard and Apps Script.
 *
 * - PIN login returns a signed, expiring token (HMAC). Nothing secret reaches the browser.
 * - Whitelisted actions are forwarded to Apps Script with the API key kept in env vars.
 *
 * Environment variables (Vercel > Settings > Environment Variables):
 *   ADMIN_PIN       dashboard PIN
 *   SESSION_SECRET  long random string used to sign sessions
 *   GAS_URL         Apps Script web app /exec URL
 *   GAS_KEY         API_KEY created by setupApiKey()
 */
import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const ALLOWED = new Set([
  'bootstrap',
  'setStatus',
  'assign',
  'setTotal',
  'payment',
  'saveDriver',
  'deleteDriver',
  'saveFleet',
]);
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const fails = new Map<string, { n: number; until: number }>();

const b64 = (data: string | Buffer) => Buffer.from(data).toString('base64url');
const sign = (body: string, secret: string) => crypto.createHmac('sha256', secret).update(body).digest('base64url');

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function makeToken(secret: string): string {
  const body = b64(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS, n: crypto.randomBytes(8).toString('hex') }));
  return `${body}.${sign(body, secret)}`;
}

function checkToken(token: string, secret: string): boolean {
  if (typeof token !== 'string' || token.length > 400) return false;
  const [body, sig] = token.split('.');
  if (!body || !sig || !safeEqual(sig, sign(body, secret))) return false;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

function json(status: number, payload: unknown) {
  return NextResponse.json(payload, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const { ADMIN_PIN, SESSION_SECRET, GAS_URL, GAS_KEY } = process.env;
  if (!ADMIN_PIN || !SESSION_SECRET || !GAS_URL || !GAS_KEY || SESSION_SECRET.length < 16) {
    return json(500, { ok: false, error: 'Server is not configured. Set ADMIN_PIN, SESSION_SECRET, GAS_URL, GAS_KEY.' });
  }

  let body: { action?: unknown; data?: unknown; pin?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const action = String(body.action ?? '');
  const ip = (request.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();

  if (action === 'login') {
    const rec = fails.get(ip) ?? { n: 0, until: 0 };
    if (rec.until > Date.now()) {
      return json(429, { ok: false, error: 'Too many attempts. Try again in a few minutes.' });
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (typeof body.pin === 'string' && body.pin.length <= 100 && safeEqual(body.pin, ADMIN_PIN)) {
      fails.delete(ip);
      return json(200, { ok: true, token: makeToken(SESSION_SECRET) });
    }
    rec.n += 1;
    if (rec.n >= 5) {
      rec.until = Date.now() + 10 * 60 * 1000;
      rec.n = 0;
    }
    fails.set(ip, rec);
    return json(401, { ok: false, error: 'Wrong PIN.' });
  }

  const auth = request.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ') || !checkToken(auth.slice(7), SESSION_SECRET)) {
    return json(401, { ok: false, error: 'Session expired. Please sign in again.' });
  }
  if (!ALLOWED.has(action)) return json(400, { ok: false, error: 'Unknown action.' });

  let url: URL;
  try {
    url = new URL(GAS_URL.trim());
  } catch {
    return json(500, { ok: false, error: 'GAS_URL is not a valid URL.' });
  }
  url.searchParams.set('api', '1');
  url.searchParams.set('key', GAS_KEY.trim());
  url.searchParams.set('action', action);
  if (body.data && typeof body.data === 'object') url.searchParams.set('data', JSON.stringify(body.data));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal, cache: 'no-store' });
    const text = await response.text();
    let parsed: { error?: string } | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      return json(502, {
        ok: false,
        error: 'Apps Script returned an unexpected response. Check the deployment (New version) and access (Anyone).',
      });
    }
    if (parsed && parsed.error === 'unauthorized') return json(502, { ok: false, error: 'Apps Script rejected GAS_KEY.' });
    return json(200, parsed);
  } catch (error) {
    const aborted = error instanceof Error && error.name === 'AbortError';
    return json(504, { ok: false, error: aborted ? 'Apps Script took too long.' : 'Could not reach Apps Script.' });
  } finally {
    clearTimeout(timer);
  }
}

export function GET() {
  return json(405, { ok: false, error: 'Method not allowed' });
}
