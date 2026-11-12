'use client';

import { useState } from 'react';

import { LANGS } from './content';
import { LangProvider, useLang } from './i18n';
import ProcessMap from './process-map';
import MeetingForm from './meeting-form';
import s from './landing.module.css';

// ----------------------------------------------------------------------

const tel = (phone) => `tel:+976${phone.replace(/\s/g, '')}`;

function Mark() {
  // Гурван эгнээ дундуур явах процессын шугам — логоны тэмдэг.
  return (
    <svg className={s.mark} viewBox="0 0 28 28" aria-hidden="true">
      <rect x="0" y="0" width="28" height="28" rx="7" className={s.markBg} />
      <path d="M5 8 H11 V14 H17 V20 H23" className={s.markPath} />
      <circle cx="23" cy="20" r="2.6" className={s.markDot} />
    </svg>
  );
}

function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div className={s.lang} role="group" aria-label={t.ui.langLabel}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          className={s.langOption}
          aria-pressed={lang === l.code}
          title={l.name}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function Header() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <header className={s.header}>
      <div className={`${s.container} ${s.headerInner}`}>
        <a href="#top" className={s.brand} onClick={() => setOpen(false)}>
          <Mark />
          <span>{t.company.name}</span>
        </a>

        <div className={s.headerTools}>
          <nav id="site-nav" className={`${s.nav} ${open ? s.navOpen : ''}`} aria-label={t.ui.navLabel}>
            {t.nav.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="#contact" className={s.navCta} onClick={() => setOpen(false)}>
              {t.hero.primary}
            </a>
          </nav>

          <LangSwitch />

          <button
            type="button"
            className={s.menuButton}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? t.ui.close : t.ui.menu}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className={s.hero}>
      <div className={`${s.container} ${s.heroGrid}`}>
        <div className={s.heroText}>
          <h1 className={s.heroTitle}>{t.hero.title}</h1>
          <p className={s.heroLead}>{t.hero.lead}</p>
          <div className={s.heroActions}>
            <a href="#contact" className={s.btnPrimary}>
              {t.hero.primary}
            </a>
            <a href="#products" className={s.btnGhost}>
              {t.hero.secondary}
            </a>
          </div>
        </div>
        <ProcessMap />
      </div>

      <div className={s.container}>
        <dl className={s.stats}>
          {t.stats.map((st) => (
            <div key={st.label} className={s.stat}>
              <dt className={s.statLabel}>{st.label}</dt>
              <dd className={s.statValue}>{st.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Services() {
  const { t } = useLang();
  const sv = t.services;
  return (
    <section id="services" className={s.section}>
      <div className={s.container}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>{sv.title}</h2>
          <p className={s.sectionLead}>{sv.lead}</p>
        </div>

        <ol className={s.steps}>
          {sv.steps.map((step, i) => (
            <li key={step.title} className={s.step}>
              <span className={s.stepNo} aria-hidden="true">
                {i + 1}
              </span>
              <h3 className={s.h3}>{step.title}</h3>
              <p className={s.body}>{step.body}</p>
            </li>
          ))}
        </ol>

        <aside className={s.audit}>
          <h3 className={s.h3}>{sv.audit.title}</h3>
          <p className={s.body}>{sv.audit.body}</p>
        </aside>
      </div>
    </section>
  );
}

function StatusChip({ status, label, dark }) {
  return (
    <span className={`${s.chip} ${s[`chip_${status}`]} ${dark ? s.chipDark : ''}`}>
      <span className={s.chipDot} aria-hidden="true" />
      {label}
    </span>
  );
}

function LoanPreview({ data }) {
  return (
    <div className={s.loanCard} aria-hidden="true">
      <div className={s.loanHead}>
        <span>{data.title}</span>
        <span className={s.loanCount}>{data.count}</span>
      </div>
      {data.rows.map((r) => (
        <div key={r.who} className={s.loanRow}>
          <span className={s.loanWho}>{r.who}</span>
          <span className={s.loanAmount}>{r.amount}</span>
          <span className={`${s.loanState} ${s[`loan_${r.tone}`]}`}>{r.state}</span>
        </div>
      ))}
    </div>
  );
}

function CourtArt() {
  // Сагсан бөмбөгийн талбайн хагас — шугаман зураг.
  return (
    <svg className={s.court} viewBox="0 0 200 150" aria-hidden="true">
      <rect x="2" y="2" width="196" height="146" />
      <rect x="70" y="2" width="60" height="72" />
      <circle cx="100" cy="74" r="22" />
      <path d="M22 2 V40 A80 80 0 0 0 178 40 V2" />
      <circle cx="100" cy="18" r="5" />
    </svg>
  );
}

function BoardArt({ columns }) {
  return (
    <div className={s.board} aria-hidden="true">
      {columns.map((c) => (
        <div key={c.col} className={s.boardCol}>
          <span className={s.boardTitle}>{c.col}</span>
          {c.cards.map((card) => (
            <span key={card} className={s.boardCard}>
              {card}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Products() {
  const { t } = useLang();
  const pr = t.products;
  const [main, ...rest] = pr.items;
  return (
    <section id="products" className={`${s.section} ${s.sectionTint}`}>
      <div className={s.container}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>{pr.title}</h2>
          <p className={s.sectionLead}>{pr.lead}</p>
        </div>

        <article className={s.productMain}>
          <div className={s.productMainText}>
            <StatusChip status={main.status} label={main.statusLabel} dark />
            <h3 className={s.productTitleLg}>{main.name}</h3>
            <p className={s.productSummaryLight}>{main.summary}</p>
            <ul className={s.featureListLight}>
              {main.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a href={main.link.href} className={s.btnAmber} target="_blank" rel="noopener noreferrer">
              {pr.visit(main.link.label)}
            </a>
          </div>
          <LoanPreview data={pr.loanPreview} />
        </article>

        <div className={s.productPair}>
          {rest.map((p) => (
            <article key={p.key} className={s.productCard}>
              {p.key === 'basketball' ? <CourtArt /> : <BoardArt columns={pr.board} />}
              <StatusChip status={p.status} label={p.statusLabel} />
              <h3 className={s.productTitle}>{p.name}</h3>
              <p className={s.body}>{p.summary}</p>
              <ul className={s.featureList}>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const { t } = useLang();
  const ex = t.experience;
  return (
    <section id="experience" className={s.section}>
      <div className={`${s.container} ${s.expGrid}`}>
        <div className={s.expIntro}>
          <h2 className={s.h2}>{ex.title}</h2>
          <p className={s.sectionLead}>{ex.lead}</p>
        </div>

        <ol className={s.timeline}>
          {ex.timeline.map((item) => (
            <li key={item.year + item.text} className={s.tItem}>
              <span className={s.tYear}>{item.year}</span>
              <div className={s.tBody}>
                <p className={s.body}>{item.text}</p>
                {item.logo && <img src={item.logo} alt={item.alt} className={s.tLogo} loading="lazy" />}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Team() {
  const { t } = useLang();
  const tm = t.team;
  return (
    <section id="team" className={`${s.section} ${s.sectionTint}`}>
      <div className={s.container}>
        <div className={s.teamGrid}>
          <div>
            <h2 className={s.h2}>{tm.title}</h2>
            <blockquote className={s.quote}>
              <p>{tm.quote}</p>
            </blockquote>
          </div>
          <ul className={s.people}>
            {tm.members.map((m) => (
              <li key={m.email} className={s.person}>
                <span className={s.avatar} aria-hidden="true">
                  {m.initials}
                </span>
                <div>
                  <p className={s.personName}>{m.name}</p>
                  <p className={s.personRole}>{m.role}</p>
                  <p className={s.personContact}>
                    <a href={tel(m.phone)}>{m.phone}</a>
                    <a href={`mailto:${m.email}`}>{m.email}</a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useLang();
  const c = t.contact;
  return (
    <section id="contact" className={s.contact}>
      <div className={`${s.container} ${s.contactGrid}`}>
        <div className={s.contactText}>
          <h2 className={s.h2Light}>{c.title}</h2>
          <p className={s.contactLead}>{c.lead}</p>
          <dl className={s.contactList}>
            <dt>{c.address}</dt>
            <dd>{t.company.address}</dd>
            <dt>{c.email}</dt>
            <dd>
              <a href={`mailto:${t.company.email}`}>{t.company.email}</a>
            </dd>
            <dt>{c.phone}</dt>
            <dd>
              {t.team.members.map((m) => (
                <span key={m.phone} className={s.contactPhone}>
                  <a href={tel(m.phone)}>{m.phone}</a> {m.name}
                </span>
              ))}
            </dd>
          </dl>
        </div>
        <MeetingForm />
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLang();
  return (
    <footer className={s.footer}>
      <div className={`${s.container} ${s.footerInner}`}>
        <span className={s.brand}>
          <Mark />
          <span>{t.company.name}</span>
        </span>
        <span>
          © {new Date().getFullYear()} {t.company.legalName}
        </span>
      </div>
    </footer>
  );
}

function Page() {
  const { t } = useLang();
  return (
    <div className={s.page}>
      <a href="#main" className={s.skip}>
        {t.ui.skip}
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Products />
        <Experience />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

// ----------------------------------------------------------------------

export default function LandingView() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  );
}
