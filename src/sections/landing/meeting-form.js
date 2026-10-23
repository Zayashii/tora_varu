'use client';

import { useState } from 'react';

import { COMPANY } from './content';
import s from './landing.module.css';

const EMPTY = { kind: 'company', regno: '', name: '', phone: '', email: '', message: '' };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Нэрээ оруулна уу.';
  if (!v.regno.trim()) e.regno = v.kind === 'company' ? 'Байгууллагын РД оруулна уу.' : 'Регистрийн дугаараа оруулна уу.';
  if (!/^[0-9+\-\s]{8,}$/.test(v.phone.trim())) e.phone = 'Утасны дугаараа 8 оронтойгоор оруулна уу.';
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'И-мэйл хаягаа зөв оруулна уу. Жишээ нь: name@company.mn';
  return e;
}

function mailtoHref(v) {
  const subject = `Уулзалт товлох хүсэлт — ${v.name}`;
  const body = [
    `Нэр: ${v.name}`,
    `${v.kind === 'company' ? 'Байгууллагын' : 'Хувь хүний'} РД: ${v.regno}`,
    `Утас: ${v.phone}`,
    `И-мэйл: ${v.email}`,
    '',
    v.message,
  ].join('\n');
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function MeetingForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | fallback

  const set = (key) => (event) => {
    setValues((v) => ({ ...v, [key]: event.target.value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setState('sending');
    try {
      const res = await fetch('/api/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
        <p className={s.formDoneTitle}>Хүсэлт илгээгдлээ</p>
        <p>Бид таны утас эсвэл и-мэйлээр холбогдож уулзалтын цагаа тохирно.</p>
        <button type="button" className={s.btnGhostLight} onClick={() => setState('idle')}>
          Өөр хүсэлт илгээх
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
        <legend className={s.fieldLabel}>Хэний нэрээр</legend>
        {[
          ['company', 'Байгууллага'],
          ['person', 'Хувь хүн'],
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
        {field('name', 'Таны нэр', { autoComplete: 'name' })}
        {field('regno', values.kind === 'company' ? 'Байгууллагын РД' : 'Регистрийн дугаар')}
        {field('phone', 'Утас', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
        {field('email', 'И-мэйл', { type: 'email', autoComplete: 'email' })}
      </div>

      <label className={s.field} htmlFor="f-message">
        <span className={s.fieldLabel}>Бизнесийнхээ тухай товч (заавал биш)</span>
        <textarea
          id="f-message"
          className={s.input}
          rows={4}
          value={values.message}
          onChange={set('message')}
          placeholder="Ямар асуудлыг шийдэх, ямар систем сонирхож буйгаа бичнэ үү."
        />
      </label>

      {state === 'fallback' && (
        <p className={s.formNotice} role="alert">
          Хүсэлтийг одоогоор шууд илгээж чадсангүй.{' '}
          <a href={mailtoHref(values)}>И-мэйлээр илгээх</a> эсвэл утсаар холбогдоно уу.
        </p>
      )}

      <button type="submit" className={s.btnAmber} disabled={state === 'sending'}>
        {state === 'sending' ? 'Илгээж байна…' : 'Хүсэлт илгээх'}
      </button>
    </form>
  );
}
