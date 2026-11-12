'use client';

import { useState } from 'react';

import { useLang } from './i18n';
import s from './landing.module.css';

const EMPTY = { kind: 'company', regno: '', name: '', phone: '', email: '', message: '' };

function validate(v, msg) {
  const e = {};
  if (!v.name.trim()) e.name = msg.name;
  if (!v.regno.trim()) e.regno = v.kind === 'company' ? msg.regnoCompany : msg.regnoPerson;
  if (!/^[0-9+\-\s]{8,}$/.test(v.phone.trim())) e.phone = msg.phone;
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = msg.email;
  return e;
}

function mailtoHref(v, to, m) {
  const body = [
    `${m.name}: ${v.name}`,
    `${v.kind === 'company' ? m.regnoCompany : m.regnoPerson}: ${v.regno}`,
    `${m.phone}: ${v.phone}`,
    `${m.email}: ${v.email}`,
    '',
    v.message,
  ].join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(m.subject(v.name))}&body=${encodeURIComponent(body)}`;
}

export default function MeetingForm() {
  const { t, lang } = useLang();
  const f = t.form;

  const [values, setValues] = useState(EMPTY);
  const [errorKeys, setErrorKeys] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | fallback

  // Алдааны мессежийг хэл солиход шинэчлэгдэхээр тухай бүр гаргана.
  const errors = Object.keys(errorKeys).length ? validate(values, f.errors) : {};
  Object.keys(errors).forEach((k) => {
    if (!errorKeys[k]) delete errors[k];
  });

  const set = (key) => (event) => {
    setValues((v) => ({ ...v, [key]: event.target.value }));
    if (errorKeys[key]) setErrorKeys((e) => ({ ...e, [key]: false }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values, f.errors);
    setErrorKeys(Object.fromEntries(Object.keys(found).map((k) => [k, true])));
    if (Object.keys(found).length) return;

    setState('sending');
    try {
      const res = await fetch('/api/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      setValues(EMPTY);
    } catch (err) {
      // Сервер тохируулаагүй эсвэл алдаа гарвал и-мэйлээр илгээх боломж үлдээнэ.
      setState('fallback');
    }
  };

  if (state === 'sent') {
    return (
      <div className={s.formDone} role="status">
        <p className={s.formDoneTitle}>{f.doneTitle}</p>
        <p>{f.doneBody}</p>
        <button type="button" className={s.btnGhostLight} onClick={() => setState('idle')}>
          {f.again}
        </button>
      </div>
    );
  }

  const field = (key, label, props = {}) => (
    <label className={s.field} htmlFor={`f-${key}`}>
      <span className={s.fieldLabel}>{label}</span>
      <input
        id={`f-${key}`}
        className={s.input}
        value={values[key]}
        onChange={set(key)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `e-${key}` : undefined}
        {...props}
      />
      {errors[key] && (
        <span id={`e-${key}`} className={s.fieldError}>
          {errors[key]}
        </span>
      )}
    </label>
  );

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <fieldset className={s.kind}>
        <legend className={s.fieldLabel}>{f.kindLegend}</legend>
        {[
          ['company', f.company],
          ['person', f.person],
        ].map(([val, text]) => (
          <label key={val} className={s.kindOption}>
            <input
              type="radio"
              name="kind"
              value={val}
              checked={values.kind === val}
              onChange={set('kind')}
            />
            <span>{text}</span>
          </label>
        ))}
      </fieldset>

      <div className={s.formGrid}>
        {field('name', f.name, { autoComplete: 'name' })}
        {field('regno', values.kind === 'company' ? f.regnoCompany : f.regnoPerson)}
        {field('phone', f.phone, { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
        {field('email', f.email, { type: 'email', autoComplete: 'email' })}
      </div>

      <label className={s.field} htmlFor="f-message">
        <span className={s.fieldLabel}>{f.message}</span>
        <textarea
          id="f-message"
          className={s.input}
          rows={4}
          value={values.message}
          onChange={set('message')}
          placeholder={f.messagePlaceholder}
        />
      </label>

      {state === 'fallback' && (
        <p className={s.formNotice} role="alert">
          {f.fallbackBefore} <a href={mailtoHref(values, t.company.email, f.mail)}>{f.fallbackLink}</a>{' '}
          {f.fallbackAfter}
        </p>
      )}

      <button type="submit" className={s.btnAmber} disabled={state === 'sending'}>
        {state === 'sending' ? f.sending : f.submit}
      </button>
    </form>
  );
}
