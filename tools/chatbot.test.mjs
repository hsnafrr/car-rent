// Run: node --test tools/chatbot.test.mjs   (the assistant is English only)
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
const ctx = { lang: 'en', vehicles, whatsapp: '6289620928296', whatsappDisplay: '0896-2092-8296', bookingUrl: 'https://morfosa-transport.vercel.app/#booking' };
const ask = (q) => reply(q, ctx);

test('price keywords send the price list', () => {
  for (const q of ['price', 'prices', 'Price list', 'PRICING', 'how much', 'rates', 'cost', 'cheapest', 'prise']) {
    const r = ask(q);
    assert.ok(r.intents.includes('price'), q + ' -> ' + r.intents);
    assert.match(r.text, /Rp550\.000/, q);
    assert.match(r.text, /Daily rental prices/);
  }
});

test('booking keywords send the booking link', () => {
  for (const q of ['booking', 'book', 'I want to book', 'booking link', 'how to book', 'reserve', 'I want to rent a car', 'booking form']) {
    const r = ask(q);
    assert.ok(r.intents.includes('booking'), q + ' -> ' + r.intents);
    assert.match(r.text, /https:\/\/morfosa-transport\.vercel\.app\/#booking/, q);
    assert.ok(r.actions.some((a) => a.type === 'book'), q);
  }
});

test('"rental price" is price only', () => {
  assert.deepEqual(ask('rental price').intents, ['price']);
});

test('price and booking in one message answers both', () => {
  const r = ask('price and how to book');
  assert.ok(r.intents.includes('price') && r.intents.includes('booking'));
  assert.match(r.text, /Rp/); assert.match(r.text, /#booking/);
});

test('vehicle name alone shows its price, booking preselects it', () => {
  const r = ask('innova');
  assert.deepEqual(r.intents, ['price']); assert.match(r.text, /850\.000/); assert.doesNotMatch(r.text, /1\.200\.000/);
  assert.ok(ask('book the innova').actions.some((a) => a.type === 'book' && a.vehicle === 'innova-reborn'));
});

test('passenger count recommends the smallest fitting vehicle', () => {
  assert.match(ask('for 5 people').text, /Agya/);
  assert.match(ask('6 passengers').text, /Avanza/);
  assert.match(ask('10 people').text, /Commuter/);
  assert.match(ask('20 people').text, /two vehicles/);
});

test('other topics', () => {
  const cases = [['how do I pay', 'payment'], ['is there insurance', 'insurance'], ['out of town extra charge', 'outoftown'], ['airport pickup', 'pickup'],
    ['opening hours', 'hours'], ['whatsapp number', 'contact'], ['where is your office', 'location'], ['cancel my booking', 'cancel'], ['is the driver included', 'included'],
    ['what vehicles do you have', 'fleet'], ['hello', 'greeting'], ['thanks', 'thanks'], ['about the company', 'about'], ['minimum rental period', 'minimum']];
  for (const [q, intent] of cases) assert.ok(ask(q).intents.includes(intent), q + ' -> ' + ask(q).intents);
});

test('every answer is English', () => {
  const indo = /\b(harga|sewa|silakan|terima kasih|halo|kami|pesan|bayar)\b/i;
  for (const q of ['price', 'book', 'hello', 'insurance', 'xyzzy', 'fleet', 'pay', 'contact', 'for 5 people']) {
    const r = ask(q);
    assert.doesNotMatch(r.text, indo, q); r.chips.forEach((c) => assert.doesNotMatch(c, indo, c));
  }
});

test('Indonesian words are not keywords anymore', () => {
  assert.deepEqual(ask('harga').intents, ['fallback']);
  assert.deepEqual(ask('pesan').intents, ['fallback']);
});

test('booking id goes to WhatsApp', () => {
  const r = ask('status MRF-261013-4899');
  assert.deepEqual(r.intents, ['status']); assert.ok(r.actions[0].href.includes('MRF-261013-4899'));
});

test('unknown, empty and hostile input never throws', () => {
  for (const q of ['', '   ', 'asdfghjkl', '<script>alert(1)</script>', '\u0000\u0001', 'a'.repeat(5000), '😀😀', null, undefined, 123, '%%%%', '{{7*7}}']) {
    const r = reply(q, ctx);
    assert.equal(typeof r.text, 'string'); assert.ok(r.text.length > 0); assert.ok(Array.isArray(r.actions)); assert.ok(Array.isArray(r.chips));
  }
  assert.deepEqual(ask('asdfghjkl').intents, ['fallback']);
});

test('greeting and normalize', () => {
  assert.match(greeting(ctx).text, /Hello/);
  assert.equal(normalize('Héllo,  WORLD!').trim(), 'hello world');
});

test('price reply matches the vehicle data', () => {
  const r = ask('price');
  for (const v of vehicles) assert.ok(r.text.includes(v.price.toLocaleString('id-ID')), v.name);
});
