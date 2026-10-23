import { NextResponse } from 'next/server';

// Нүүр хуудасны "Уулзалт товлох" маягтын хүсэлтийг хүлээн авна.
//
// MEETING_WEBHOOK_URL орчны хувьсагчид заасан хаяг руу JSON-оор дамжуулна
// (жишээ нь өөрсдийн backend, Make/Zapier, Google Apps Script, Slack webhook).
// Тохируулаагүй бол 503 буцааж, маягт хэрэглэгчид и-мэйлээр илгээх
// сонголт харуулна — хүсэлт чимээгүй алга болохгүй.

export const dynamic = 'force-dynamic';

const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const data = {
    kind: payload.kind === 'person' ? 'person' : 'company',
    regno: clean(payload.regno, 20),
    name: clean(payload.name, 120),
    phone: clean(payload.phone, 30),
    email: clean(payload.email, 120),
    message: clean(payload.message, 2000),
    submittedAt: new Date().toISOString(),
    source: 'toravaru.mn',
  };

  if (!data.name || !data.regno || !data.phone || !/^\S+@\S+\.\S+$/.test(data.email)) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 422 });
  }

  const target = process.env.MEETING_WEBHOOK_URL;
  if (!target) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  try {
    const res = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
  } catch (err) {
    console.error('[meeting] forward failed:', err);
    return NextResponse.json({ ok: false, error: 'upstream_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
