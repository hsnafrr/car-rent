// Run: node --test tools/chatbot.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { reply, greeting, normalize } from '../src/lib/chatbot/engine.ts';

const vehicles = [
  { slug: 'agya-brio', name: 'Toyota Agya / Honda Brio', seats: 5, price: 550000 },
  { slug: 'avanza-xenia', name: 'Toyota Avanza / Daihatsu Xenia', seats: 7, price: 650000 },
  { slug: 'innova-reborn', name: 'Toyota Innova Reborn', seats: 7, price: 850000 },
  { slug: 'hiace-commuter', name: 'Toyota Hiace Commuter', seats: 14, price: 1200000 },
  { slug: 'hiace-premio', name: 'Toyota Hiace Premio', seats: 14, price: 1500000 },
  { slug: 'grandmax-blindvan', name: 'Grandmax Blindvan', seats: 2, price: 550000 },
];
const ctx = (lang = 'id') => ({ lang, vehicles, whatsapp: '6289620928296', whatsappDisplay: '0896-2092-8296', bookingUrl: 'https://morfosa-transport.vercel.app/#booking' });
const ask = (q, lang) => reply(q, ctx(lang));

test('price keyword sends the price list', () => {
  for (const q of ['harga', 'Harga sewa berapa?', 'price', 'PRICE LIST', 'tarif sewa', 'hrga', 'how much']) {
    const r = ask(q, /price|how/i.test(q) ? 'en' : 'id');
    assert.ok(r.intents.includes('price'), q + ' -> ' + r.intents);
    assert.match(r.text, /Rp550\.000/, q);
  }
});

test('booking keyword sends the booking link', () => {
  for (const q of ['booking', 'mau booking', 'cara pesan', 'link booking', 'book', 'Mau sewa dong', 'how to book', 'reservasi']) {
    const r = ask(q, /how|^book$/i.test(q) ? 'en' : 'id');
    assert.ok(r.intents.includes('booking'), q + ' -> ' + r.intents);
    assert.match(r.text, /https:\/\/morfosa-transport\.vercel\.app\/#booking/, q);
    assert.ok(r.actions.some((a) => a.type === 'book'), q);
  }
});

test('"harga sewa" is price only, not booking', () => {
  assert.deepEqual(ask('harga sewa').intents, ['price']);
});

test('price and booking in one message answers both', () => {
  const r = ask('harga dan cara booking');
  assert.ok(r.intents.includes('price') && r.intents.includes('booking'));
  assert.match(r.text, /Rp/); assert.match(r.text, /#booking/);
});

test('vehicle name alone shows its price and preselects it on booking', () => {
  const r = ask('innova');
  assert.deepEqual(r.intents, ['price']); assert.match(r.text, /850\.000/); assert.doesNotMatch(r.text, /1\.200\.000/);
  const b = ask('booking innova');
  assert.ok(b.actions.some((a) => a.type === 'book' && a.vehicle === 'innova-reborn'));
});

test('passenger count recommends the smallest fitting vehicle', () => {
  assert.match(ask('untuk 5 orang').text, /Agya/);
  assert.match(ask('6 orang').text, /Avanza/);
  assert.match(ask('10 orang').text, /Commuter/);
  assert.match(ask('20 orang').text, /dua kendaraan/);
  assert.match(ask('for 12 people', 'en').text, /Commuter/);
});

test('other topics', () => {
  const cases = [['bayar pakai apa', 'payment'], ['ada asuransi?', 'insurance'], ['biaya luar kota', 'outoftown'], ['jemput di bandara', 'pickup'],
    ['jam buka', 'hours'], ['nomor wa', 'contact'], ['alamat kantor', 'location'], ['batal booking', 'cancel'], ['sudah termasuk sopir?', 'included'],
    ['armada apa saja', 'fleet'], ['halo', 'greeting'], ['makasih', 'thanks']];
  for (const [q, intent] of cases) assert.ok(ask(q).intents.includes(intent), q + ' -> ' + ask(q).intents);
});

test('english answers are english', () => {
  assert.match(ask('prices', 'en').text, /Daily rental prices/);
  assert.match(ask('booking', 'en').text, /Great!/);
});

test('booking id goes to WhatsApp', () => {
  const r = ask('status MRF-261013-4899');
  assert.deepEqual(r.intents, ['status']); assert.ok(r.actions[0].href.includes('MRF-261013-4899'));
});

test('unknown, empty and hostile input never throws', () => {
  for (const q of ['', '   ', 'asdfghjkl', '<script>alert(1)</script>', '\u0000\u0001', 'a'.repeat(5000), '😀😀', null, undefined, 123, '%%%%', '{{7*7}}']) {
    const r = reply(q, ctx());
    assert.equal(typeof r.text, 'string'); assert.ok(r.text.length > 0); assert.ok(Array.isArray(r.actions)); assert.ok(Array.isArray(r.chips));
  }
  assert.deepEqual(ask('asdfghjkl').intents, ['fallback']);
});

test('greeting message exists in both languages and normalize strips accents', () => {
  assert.match(greeting(ctx('id')).text, /Halo/); assert.match(greeting(ctx('en')).text, /Hello/);
  assert.equal(normalize('Héllo,  WORLD!').trim(), 'hello world');
});

test('every price reply stays consistent with the vehicle data', () => {
  const r = ask('harga');
  for (const v of vehicles) assert.ok(r.text.includes(v.price.toLocaleString('id-ID')), v.name);
});
