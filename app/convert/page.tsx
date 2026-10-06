'use client';

import { useMemo, useState } from 'react';

const units: Record<string, Record<string, number>> = {
  Length: { in: 0.0254, ft: 0.3048, yd: 0.9144, m: 1, mm: 0.001, cm: 0.01, km: 1000, mi: 1609.344 },
  Mass: { g: 0.001, kg: 1, lb: 0.45359237, oz: 0.028349523125 },
  Time: { s: 1, min: 60, h: 3600, day: 86400 },
  Area: { 'm²': 1, 'ft²': 0.09290304, 'in²': 0.00064516, 'km²': 1_000_000, acre: 4046.8564224 },
  Volume: { L: 1, mL: 0.001, cup: 0.2365882365, gal: 3.785411784, qt: 0.946352946, pt: 0.473176473 },
  Speed: { 'm/s': 1, 'km/h': 0.2777777778, mph: 0.44704, 'ft/min': 0.00508 },
};

const currencies = ['USD', 'CAD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CHF', 'CNY', 'KRW', 'INR', 'MXN', 'BRL', 'SGD', 'HKD'];
const currencyNames: Record<string, string> = {
  USD: 'US Dollar', CAD: 'Canadian Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
  AUD: 'Australian Dollar', NZD: 'New Zealand Dollar', CHF: 'Swiss Franc', CNY: 'Chinese Yuan',
  KRW: 'South Korean Won', INR: 'Indian Rupee', MXN: 'Mexican Peso', BRL: 'Brazilian Real',
  SGD: 'Singapore Dollar', HKD: 'Hong Kong Dollar'
};

const categories = [...Object.keys(units), 'Temperature', 'Currency'];

function cleanNumber(n: number) {
  if (!Number.isFinite(n)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 10 }).format(n);
}

export default function Page() {
  const [cat, setCat] = useState('Length');
  const [v, setV] = useState('26');
  const [from, setFrom] = useState('in');
  const [to, setTo] = useState('mm');
  const [rate, setRate] = useState('');

  const opts = cat === 'Currency' ? currencies : cat === 'Temperature' ? ['°C', '°F', 'K'] : Object.keys(units[cat]);

  const res = useMemo(() => {
    const n = Number(v);
    if (!Number.isFinite(n)) return '';

    if (cat === 'Currency') {
      if (from === to) return cleanNumber(n);
      const r = Number(rate);
      if (!Number.isFinite(r) || r <= 0) return '';
      return cleanNumber(n * r);
    }

    if (cat === 'Temperature') {
      let c = n;
      if (from === '°F') c = (n - 32) * 5 / 9;
      if (from === 'K') c = n - 273.15;
      let out = c;
      if (to === '°F') out = c * 9 / 5 + 32;
      if (to === 'K') out = c + 273.15;
      return cleanNumber(out);
    }

    return cleanNumber(n * units[cat][from] / units[cat][to]);
  }, [v, cat, from, to, rate]);

  function changeCat(c: string) {
    setCat(c);
    setRate('');
    if (c === 'Currency') { setFrom('USD'); setTo('CAD'); return; }
    if (c === 'Temperature') { setFrom('°C'); setTo('°F'); return; }
    const o = Object.keys(units[c]);
    setFrom(o[0]); setTo(o[1]);
  }

  function swap() {
    setFrom(to); setTo(from);
    if (cat === 'Currency') {
      const r = Number(rate);
      if (Number.isFinite(r) && r > 0) setRate(String(1 / r));
    }
  }

  return <>
    <div className="hero">
      <h1 className="title">Converter</h1>
      <p className="muted">Convert units and currencies with transparent math.</p>
    </div>
    <section className="card stack">
      <label className="stack" style={{gap: 6}}><span className="label">Category</span>
        <select value={cat} onChange={e => changeCat(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select>
      </label>
      <label className="stack" style={{gap: 6}}><span className="label">Amount</span>
        <input value={v} onChange={e => setV(e.target.value)} inputMode="decimal" aria-label="Amount to convert" />
      </label>
      <div className="row">
        <select value={from} onChange={e => { setFrom(e.target.value); if (cat === 'Currency') setRate(''); }} aria-label="From unit">
          {opts.map(o => <option key={o} value={o}>{cat === 'Currency' ? `${o} · ${currencyNames[o]}` : o}</option>)}
        </select>
        <button className="btn" onClick={swap} type="button">Swap</button>
        <select value={to} onChange={e => { setTo(e.target.value); if (cat === 'Currency') setRate(''); }} aria-label="To unit">
          {opts.map(o => <option key={o} value={o}>{cat === 'Currency' ? `${o} · ${currencyNames[o]}` : o}</option>)}
        </select>
      </div>

      {cat === 'Currency' && from !== to && <div className="stack" style={{gap: 6}}>
        <label className="label" htmlFor="exchange-rate">Exchange rate</label>
        <input id="exchange-rate" value={rate} onChange={e => setRate(e.target.value)} inputMode="decimal" placeholder={`1 ${from} = ? ${to}`} />
        <p className="muted" style={{margin: 0}}>Enter the exchange rate from your problem, bank, or another current source. Formula Desk does not claim a hardcoded rate is live.</p>
      </div>}

      <div>
        <div className="label">Result</div>
        <div className="answer">{res || (cat === 'Currency' ? 'Enter an exchange rate' : 'Enter a value')} {res ? to : ''}</div>
        {cat === 'Currency' && res && from !== to && <p className="muted">{v} {from} × {rate} = {res} {to}</p>}
      </div>
    </section>
  </>;
}
