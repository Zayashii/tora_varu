'use client';

import { useState } from 'react';

import {
  AUDIT,
  COMPANY,
  HERO,
  NAV,
  PRODUCTS,
  QUOTE,
  SERVICES,
  STATS,
  TEAM,
  TIMELINE,
} from './content';
import ProcessMap from './process-map';
import MeetingForm from './meeting-form';
import s from './landing.module.css';

// ----------------------------------------------------------------------

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

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className={s.header}>
      <div className={`${s.container} ${s.headerInner}`}>
        <a href="#top" className={s.brand} onClick={() => setOpen(false)}>
          <Mark />
          <span>{COMPANY.name}</span>
        </a>

        <button
          type="button"
          className={s.menuButton}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Хаах' : 'Цэс'}
        </button>

        <nav id="site-nav" className={`${s.nav} ${open ? s.navOpen : ''}`} aria-label="Үндсэн цэс">
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#contact" className={s.navCta} onClick={() => setOpen(false)}>
            {HERO.primary}
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className={s.hero}>
      <div className={`${s.container} ${s.heroGrid}`}>
        <div className={s.heroText}>
          <h1 className={s.heroTitle}>{HERO.title}</h1>
          <p className={s.heroLead}>{HERO.lead}</p>
          <div className={s.heroActions}>
            <a href="#contact" className={s.btnPrimary}>
              {HERO.primary}
            </a>
            <a href="#products" className={s.btnGhost}>
              {HERO.secondary}
            </a>
          </div>
        </div>
        <ProcessMap />
      </div>

      <div className={s.container}>
        <dl className={s.stats}>
          {STATS.map((st) => (
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
  return (
    <section id="services" className={s.section}>
      <div className={s.container}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>Ажлын арга</h2>
          <p className={s.sectionLead}>
            Төсөл бүр дөрвөн шатаар явагдана. Аль ч шатнаас нь эхлэн хамтарч ажиллах боломжтой.
          </p>
        </div>

        <ol className={s.steps}>
          {SERVICES.map((sv, i) => (
            <li key={sv.title} className={s.step}>
              <span className={s.stepNo} aria-hidden="true">
                {i + 1}
              </span>
              <h3 className={s.h3}>{sv.title}</h3>
              <p className={s.body}>{sv.body}</p>
            </li>
          ))}
        </ol>

        <aside className={s.audit}>
          <h3 className={s.h3}>{AUDIT.title}</h3>
          <p className={s.body}>{AUDIT.body}</p>
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

const LOAN_ROWS = [
  { who: 'Б.Энхтуяа', amount: '3,500,000₮', state: 'Хэвийн', tone: 'ok' },
  { who: 'Г.Тэмүүлэн', amount: '1,200,000₮', state: '12 хоног хэтэрсэн', tone: 'late' },
  { who: 'Д.Сарангэрэл', amount: '5,000,000₮', state: 'Сунгасан', tone: 'ext' },
  { who: 'О.Батбаяр', amount: '800,000₮', state: 'Хэвийн', tone: 'ok' },
];

function LoanPreview() {
  return (
    <div className={s.loanCard} aria-hidden="true">
      <div className={s.loanHead}>
        <span>Зээлийн жагсаалт</span>
        <span className={s.loanCount}>4 зээл</span>
      </div>
      {LOAN_ROWS.map((r) => (
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

const BOARD = [
  { col: 'Хийх', cards: ['Тайлангийн загвар', 'Хэрэглэгчийн эрх'] },
  { col: 'Хийгдэж буй', cards: ['KPI холболт'] },
  { col: 'Дууссан', cards: ['Самбар харагдац', 'Мэдэгдэл'] },
];

function BoardArt() {
  return (
    <div className={s.board} aria-hidden="true">
      {BOARD.map((c) => (
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
  const [main, ...rest] = PRODUCTS;
  return (
    <section id="products" className={`${s.section} ${s.sectionTint}`}>
      <div className={s.container}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>Бүтээгдэхүүн</h2>
          <p className={s.sectionLead}>
            Харилцагчийн төслөөс гадна туршлага дээрээ суурилан өөрсдийн системүүдийг хөгжүүлсэн.
          </p>
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
              {main.link.label} сайтад орох
            </a>
          </div>
          <LoanPreview />
        </article>

        <div className={s.productPair}>
          {rest.map((p) => (
            <article key={p.key} className={s.productCard}>
              {p.key === 'basketball' ? <CourtArt /> : <BoardArt />}
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
  return (
    <section id="experience" className={s.section}>
      <div className={`${s.container} ${s.expGrid}`}>
        <div className={s.expIntro}>
          <h2 className={s.h2}>Туршлага</h2>
          <p className={s.sectionLead}>
            Сүүлийн 10 жилд банк бус санхүүгийн байгууллага, үйлдвэрлэл худалдааны компаниудад зээлийн
            систем болон ERP нэвтрүүлэх чиглэлээр голчлон ажилласан.
          </p>
        </div>

        <ol className={s.timeline}>
          {TIMELINE.map((t) => (
            <li key={t.year + t.text} className={s.tItem}>
              <span className={s.tYear}>{t.year}</span>
              <div className={s.tBody}>
                <p className={s.body}>{t.text}</p>
                {t.logo && <img src={t.logo} alt={t.alt} className={s.tLogo} loading="lazy" />}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className={`${s.section} ${s.sectionTint}`}>
      <div className={s.container}>
        <div className={s.teamGrid}>
          <div>
            <h2 className={s.h2}>Баг</h2>
            <blockquote className={s.quote}>
              <p>{QUOTE}</p>
            </blockquote>
          </div>
          <ul className={s.people}>
            {TEAM.map((m) => (
              <li key={m.name} className={s.person}>
                <span className={s.avatar} aria-hidden="true">
                  {m.initials}
                </span>
                <div>
                  <p className={s.personName}>{m.name}</p>
                  <p className={s.personRole}>{m.role}</p>
                  <p className={s.personContact}>
                    <a href={`tel:+976${m.phone.replace(/\s/g, '')}`}>{m.phone}</a>
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
  return (
    <section id="contact" className={s.contact}>
      <div className={`${s.container} ${s.contactGrid}`}>
        <div className={s.contactText}>
          <h2 className={s.h2Light}>Уулзалт товлох</h2>
          <p className={s.contactLead}>
            Бизнесийнхээ тухай товч бичээд илгээгээрэй. Бид холбогдож, уулзах цагаа тохирно.
          </p>
          <dl className={s.contactList}>
            <dt>Хаяг</dt>
            <dd>{COMPANY.address}</dd>
            <dt>И-мэйл</dt>
            <dd>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </dd>
            <dt>Утас</dt>
            <dd>
              {TEAM.map((m) => (
                <span key={m.phone} className={s.contactPhone}>
                  <a href={`tel:+976${m.phone.replace(/\s/g, '')}`}>{m.phone}</a> {m.name}
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
  return (
    <footer className={s.footer}>
      <div className={`${s.container} ${s.footerInner}`}>
        <span className={s.brand}>
          <Mark />
          <span>{COMPANY.name}</span>
        </span>
        <span>
          © {new Date().getFullYear()} {COMPANY.legalName}
        </span>
      </div>
    </footer>
  );
}

// ----------------------------------------------------------------------

export default function LandingView() {
  return (
    <div className={s.page}>
      <a href="#main" className={s.skip}>
        Үндсэн агуулга руу шилжих
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
