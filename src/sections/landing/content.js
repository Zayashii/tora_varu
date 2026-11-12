// Нүүр хуудасны бүх текст, тоо баримт энд байна — Монгол (mn), Англи (en).
// Агуулга солих бол зөвхөн энэ файлыг засахад хангалттай.
// Хоёр хэлний бүтэц ижил байх ёстой: нэг талд нэмсэн зүйлээ нөгөө талд ч нэмнэ.

export const DEFAULT_LANG = 'mn';

export const LANGS = [
  { code: 'mn', label: 'MN', name: 'Монгол' },
  { code: 'en', label: 'EN', name: 'English' },
];

// ---------------------------------------------------------------------
// Хэлнээс үл хамаарах мэдээлэл

const EMAIL = 'baldandorj.v@gmail.com';
const KHURGAN_URL = 'https://www.khurganzeel.mn';

const LOGOS = {
  grape: '/assets/completed-projects/grape-city.svg',
  bichil: '/assets/completed-projects/bichil.svg',
  gsb: '/assets/completed-projects/gsb.svg',
  apu: '/assets/completed-projects/apu.svg',
  talh: '/assets/completed-projects/talh-chiher.svg',
  mcommerce: '/assets/completed-projects/mcommerce2.svg',
};

const PEOPLE = [
  { initialsMn: 'ВБ', initialsEn: 'VB', phone: '9903 8090', email: 'baldandorj.v@gmail.com' },
  { initialsMn: 'БМ', initialsEn: 'BM', phone: '9995 4236', email: 'munkhzaya@toravaru.mn' },
];

// Процессын зураглалын алхам бүр аль эгнээнд (0 бизнес, 1 процесс, 2 систем) байрлахыг заана.
const STEP_LANES = [0, 1, 1, 2, 2, 0];

// ---------------------------------------------------------------------
// Монгол

const mn = {
  meta: {
    title: 'Тора Вару — бизнес процесс, систем нэвтрүүлэлт',
  },
  company: {
    name: 'Тора Вару',
    legalName: 'Тора Вару ХХК',
    address: 'Улаанбаатар, Сүхбаатар дүүрэг, 2-р хороо, Гаруда центр, 504 тоот',
    email: EMAIL,
  },
  ui: {
    skip: 'Үндсэн агуулга руу шилжих',
    menu: 'Цэс',
    close: 'Хаах',
    navLabel: 'Үндсэн цэс',
    langLabel: 'Хэл сонгох',
  },
  nav: [
    { id: 'services', label: 'Үйлчилгээ' },
    { id: 'products', label: 'Бүтээгдэхүүн' },
    { id: 'experience', label: 'Туршлага' },
    { id: 'team', label: 'Баг' },
    { id: 'contact', label: 'Холбоо барих' },
  ],
  hero: {
    title: 'Таны бизнесийн дараагийн дижитал процессыг загварчилна',
    lead:
      'Бизнесийн судалгаанаас эхлээд систем нэвтрүүлэх хүртэлх бүх шатыг нэг баг хариуцна. ' +
      'Санхүү, үйлдвэрлэл, худалдааны салбарт 10 гаруй жил ажилласан туршлагатай.',
    primary: 'Уулзалт товлох',
    secondary: 'Бүтээгдэхүүн үзэх',
  },
  process: {
    title: 'Төслийн явц: санаа, процессын зураглал, шаардлага, хөгжүүлэлт, нэвтрүүлэлт, үр дүн',
    lanes: ['Бизнес', 'Процесс', 'Систем'],
    steps: ['Санаа', 'Зураглал', 'Шаардлага', 'Хөгжүүлэлт', 'Нэвтрүүлэлт', 'Үр дүн'],
  },
  stats: [
    { value: '10+', label: 'жилийн туршлага' },
    { value: '50+', label: 'төсөлд зөвлөх үйлчилгээ' },
    { value: '7+', label: 'нэвтрүүлсэн систем' },
    { value: '3', label: 'өөрсдийн бүтээгдэхүүн' },
  ],
  services: {
    title: 'Ажлын арга',
    lead: 'Төсөл бүр дөрвөн шатаар явагдана. Аль ч шатнаас нь эхлэн хамтарч ажиллах боломжтой.',
    steps: [
      {
        title: 'Бизнес процессын зураглал',
        body:
          'Өдөр, сар, улирал, жилээр давтагддаг бүх процессыг орхигдуулалгүй зураглаж, давхцал болон ' +
          'цоорхойг тодорхойлно. Процесс бүрт шаардагдах ур чадвар, хүн цагийг тооцно. Энэ нь компанийн ' +
          'бодлогын баримт бичиг болон системийн шаардлагын суурь болдог.',
      },
      {
        title: 'Программын шаардлага',
        body:
          'Бизнес модель, процессын судалгаанд үндэслэн ямар систем хэрэгтэйг тодорхойлно. Хүснэгтийн ' +
          'бүтэц, функц, сервер, сервисийн төлөвлөгөө, хэрэглэгчийн дэлгэцийн загвар (UX mockup) бүхий ' +
          'хөгжүүлэлтийн шаардлагын баримт бичиг гаргана.',
      },
      {
        title: 'Төсөл удирдах, нэвтрүүлэх',
        body:
          'Зөвлөх үйлчилгээнээс эхлээд төслийг өөрсдийн багаар бүрэн гүйцэтгэх хүртэл хамтарч ажиллана: ' +
          'хөгжүүлэлт, тестийн гарын авлага, сургалт, мастер дата тохиргоо, бодит орчинд аюулгүй нэвтрүүлэлт, ' +
          'дэмжлэгийн гэрээ.',
      },
      {
        title: 'KPI үнэлгээний тогтолцоо',
        body:
          'Ажлын байр бүрийн бүтээмжийг хэмжих нэгжийг гаргаж, компанийн түвшинд нэгтгэн цалин урамшууллын ' +
          'тооцоотой холбоно. Үнэлгээг хүний оролцоогүй, системд суурилсан автомат болгоно.',
      },
    ],
    audit: {
      title: 'Одоо ашиглаж буй системийн шинжилгээ',
      body:
        'Back-end талд мэдээллийн урсгал, функцуудыг шалгаж шаардлагагүй ачааллыг цэвэрлэнэ. Front-end талд ' +
        'хэрэглэгчийн дэлгэцийг илүү ойлгомжтой болгож, илүүдэл алхмуудыг хасах санал гаргана.',
    },
  },
  products: {
    title: 'Бүтээгдэхүүн',
    lead: 'Харилцагчийн төслөөс гадна туршлага дээрээ суурилан өөрсдийн системүүдийг хөгжүүлсэн.',
    visit: (label) => `${label} сайтад орох`,
    // status: 'live' | 'build' | 'analysis'
    items: [
      {
        key: 'khurgan',
        name: 'Хурган зээл',
        status: 'live',
        statusLabel: 'Ашиглалтад',
        summary:
          'Банк бус санхүүгийн байгууллага, жижиг зээлдүүлэгчдэд зориулсан зээлийн удирдлагын систем. ' +
          'Зээл олгохоос эхлээд эргэн төлөлт, тайлан хүртэл нэг дор.',
        features: [
          'Зээл олгох, сунгах, хаах, хугацааны хяналт',
          'Хугацаа хэтэрсэн зээл, эрсдэлийн жагсаалт',
          'Харилцагч, гэрээ, барьцаа хөрөнгийн бүртгэл',
          'Мөнгөн журнал, дансны хуулга, санхүүгийн тайлан',
          'Төлөвлөсөн болон масс SMS мэдэгдэл',
        ],
        link: { href: KHURGAN_URL, label: 'khurganzeel.mn' },
      },
      {
        key: 'basketball',
        name: 'Сагсан бөмбөгийн багийн удирдлага, анализын систем',
        status: 'live',
        statusLabel: 'Хөгжүүлж дууссан',
        summary:
          'Клуб, багийн өдөр тутмын удирдлага болон тоглолтын анализыг нэг системд төвлөрүүлнэ. ' +
          'Тоглогч, бэлтгэл, тоглолтын мэдээллээс дасгалжуулагчид шийдвэр гаргахад хэрэгтэй статистикийг гаргана.',
        features: [
          'Тоглогч, дасгалжуулагчийн бүртгэл, гэрээ',
          'Бэлтгэл, тоглолтын хуваарь',
          'Тоглолтын болон тоглогчийн статистик, анализ',
          'Бэртэл, эрүүл мэндийн хяналт',
        ],
      },
      {
        key: 'tasks',
        name: 'Task management систем',
        status: 'live',
        statusLabel: 'Хөгжүүлж дууссан',
        summary:
          'Багийн ажлыг даалгавраар төлөвлөж, хариуцагч, хугацаа, явцыг нэг дороос хянах систем. ' +
          'KPI үнэлгээтэй холбогдож, гүйцэтгэлийг автоматаар тооцно.',
        features: [
          'Даалгавар үүсгэх, хариуцагч, хугацаа оноох',
          'Самбар (kanban) болон жагсаалтаар явц хянах',
          'Гүйцэтгэлийг KPI үнэлгээтэй холбох',
        ],
      },
    ],
    // Бүтээгдэхүүний жишээ дэлгэцүүд (зураг шиг харагдана)
    loanPreview: {
      title: 'Зээлийн жагсаалт',
      count: '4 зээл',
      rows: [
        { who: 'Б.Энхтуяа', amount: '3,500,000₮', state: 'Хэвийн', tone: 'ok' },
        { who: 'Г.Тэмүүлэн', amount: '1,200,000₮', state: '12 хоног хэтэрсэн', tone: 'late' },
        { who: 'Д.Сарангэрэл', amount: '5,000,000₮', state: 'Сунгасан', tone: 'ext' },
        { who: 'О.Батбаяр', amount: '800,000₮', state: 'Хэвийн', tone: 'ok' },
      ],
    },
    board: [
      { col: 'Хийх', cards: ['Тайлангийн загвар', 'Хэрэглэгчийн эрх'] },
      { col: 'Хийгдэж буй', cards: ['KPI холболт'] },
      { col: 'Дууссан', cards: ['Самбар харагдац', 'Мэдэгдэл'] },
    ],
  },
  experience: {
    title: 'Туршлага',
    lead:
      'Сүүлийн 10 жилд банк бус санхүүгийн байгууллага, үйлдвэрлэл худалдааны компаниудад зээлийн ' +
      'систем болон ERP нэвтрүүлэх чиглэлээр голчлон ажилласан.',
    timeline: [
      {
        year: '2016',
        text: 'Бичил Глобус компанид Grape City-ийн зээлийн core систем нэвтрүүлэв.',
        logo: LOGOS.grape,
        alt: 'Grape City',
      },
      {
        year: '2017',
        text: 'Групп компанийн бизнес процессын зураглал, тохирох ERP системийн судалгаа, хөгжүүлэлтийн төлөвлөгөө гаргав.',
        logo: LOGOS.bichil,
        alt: 'Бичил Глобус',
      },
      {
        year: '2018',
        text: 'Соно финтек системийн төслийг санаачилж, судалгаа, шаардлага, төлөвлөгөөг бүрэн боловсруулав.',
      },
      { year: '2019', text: 'Соно апп 6-р сарын 19-нд зах зээлд гарав.' },
      {
        year: '2020',
        text: 'Жи Эс Пи ББСБ-д зээлийн core систем болон зээлийн апп нэвтрүүлэв.',
        logo: LOGOS.gsb,
        alt: 'GSB Capital',
      },
      { year: '2021', text: 'М кредит зээлийн аппын төслийг эхлүүлж, хөгжүүлэлтийг гүйцэтгэв.' },
      {
        year: '2022',
        text: 'АПУ ХК-ийн охин компаниуд болох СББ Трэйд, АПУ Трэйд, АПУ Дэйрид Ultimate ERP системийг өөрчлөн хөгжүүлж нэвтрүүлэв.',
        logo: LOGOS.apu,
        alt: 'АПУ',
      },
      {
        year: '2023',
        text: 'Талх Чихэр ХК-д Ultimate ERP системийг өөрчлөн хөгжүүлж нэвтрүүлэв.',
        logo: LOGOS.talh,
        alt: 'Талх Чихэр',
      },
      {
        year: '2024',
        text: 'Мерчант Коммерси ХХК-ийг үүсгэн байгуулж, бүрэн өөрсдийн багаар хэрэгжүүлэх төслөө эхлүүлэв.',
        logo: LOGOS.mcommerce,
        alt: 'M Commerce',
      },
      { year: '2025', text: 'Жижиг санхүүгийн салбарт зориулсан Хурган зээл системийг нэвтрүүлэв.' },
    ],
  },
  team: {
    title: 'Баг',
    quote:
      'Бизнесээ хөгжүүлэх шинэ санаа хаанаас ч гарч болно. Харин түүнийг боловсруулж, бодит бизнест ' +
      'нэвтрүүлж үр дүнд хүргэдгээрээ манай баг ялгардаг.',
    members: [
      { ...PEOPLE[0], initials: PEOPLE[0].initialsMn, name: 'В.Балдандорж', role: 'Үүсгэн байгуулагч, бизнес шинжээч' },
      { ...PEOPLE[1], initials: PEOPLE[1].initialsMn, name: 'Б.Мөнхзаяа', role: 'Төслийн менежер, UI/UX шинжээч' },
    ],
  },
  contact: {
    title: 'Уулзалт товлох',
    lead: 'Бизнесийнхээ тухай товч бичээд илгээгээрэй. Бид холбогдож, уулзах цагаа тохирно.',
    address: 'Хаяг',
    email: 'И-мэйл',
    phone: 'Утас',
  },
  form: {
    kindLegend: 'Хэний нэрээр',
    company: 'Байгууллага',
    person: 'Хувь хүн',
    name: 'Таны нэр',
    regnoCompany: 'Байгууллагын РД',
    regnoPerson: 'Регистрийн дугаар',
    phone: 'Утас',
    email: 'И-мэйл',
    message: 'Бизнесийнхээ тухай товч (заавал биш)',
    messagePlaceholder: 'Ямар асуудлыг шийдэх, ямар систем сонирхож буйгаа бичнэ үү.',
    submit: 'Хүсэлт илгээх',
    sending: 'Илгээж байна…',
    errors: {
      name: 'Нэрээ оруулна уу.',
      regnoCompany: 'Байгууллагын РД оруулна уу.',
      regnoPerson: 'Регистрийн дугаараа оруулна уу.',
      phone: 'Утасны дугаараа 8 оронтойгоор оруулна уу.',
      email: 'И-мэйл хаягаа зөв оруулна уу. Жишээ нь: name@company.mn',
    },
    fallbackBefore: 'Хүсэлтийг одоогоор шууд илгээж чадсангүй.',
    fallbackLink: 'И-мэйлээр илгээх',
    fallbackAfter: 'эсвэл утсаар холбогдоно уу.',
    doneTitle: 'Хүсэлт илгээгдлээ',
    doneBody: 'Бид таны утас эсвэл и-мэйлээр холбогдож уулзалтын цагаа тохирно.',
    again: 'Өөр хүсэлт илгээх',
    mail: {
      subject: (name) => `Уулзалт товлох хүсэлт — ${name}`,
      name: 'Нэр',
      regnoCompany: 'Байгууллагын РД',
      regnoPerson: 'Хувь хүний РД',
      phone: 'Утас',
      email: 'И-мэйл',
    },
  },
};

// ---------------------------------------------------------------------
// English

const en = {
  meta: {
    title: 'Tora Varu — business process & system implementation',
  },
  company: {
    name: 'Tora Varu',
    legalName: 'Tora Varu LLC',
    address: 'Office 504, Garuda Center, 2nd khoroo, Sukhbaatar district, Ulaanbaatar, Mongolia',
    email: EMAIL,
  },
  ui: {
    skip: 'Skip to main content',
    menu: 'Menu',
    close: 'Close',
    navLabel: 'Main menu',
    langLabel: 'Choose language',
  },
  nav: [
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'experience', label: 'Experience' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' },
  ],
  hero: {
    title: 'We design the next digital process for your business',
    lead:
      'One team takes you from business analysis all the way to a working system. ' +
      'Over 10 years of experience in finance, manufacturing and retail.',
    primary: 'Book a meeting',
    secondary: 'See our products',
  },
  process: {
    title: 'Project flow: idea, process mapping, requirements, development, rollout, results',
    lanes: ['Business', 'Process', 'System'],
    steps: ['Idea', 'Mapping', 'Specs', 'Build', 'Rollout', 'Results'],
  },
  stats: [
    { value: '10+', label: 'years of experience' },
    { value: '50+', label: 'consulting projects' },
    { value: '7+', label: 'systems implemented' },
    { value: '3', label: 'products of our own' },
  ],
  services: {
    title: 'How we work',
    lead: 'Every project runs in four stages. You can bring us in at any one of them.',
    steps: [
      {
        title: 'Business process mapping',
        body:
          'We map every daily, monthly, quarterly and yearly process without gaps, and find overlaps and ' +
          'missing steps. For each process we estimate the skills and person-hours it needs. The map becomes ' +
          'the basis for company policy documents and system requirements.',
      },
      {
        title: 'Software requirements',
        body:
          'Based on your business model and process study, we define the system you actually need, and write ' +
          'a development spec with database structure, functions, server and service plan, and UX mockups ' +
          'of every user screen.',
      },
      {
        title: 'Project management and rollout',
        body:
          'From consulting only to delivering the whole project with our own team: development, test guides, ' +
          'training, master data setup, a safe launch into production, and a support agreement.',
      },
      {
        title: 'KPI evaluation framework',
        body:
          'We define how to measure the output of every role, roll it up to company level and link it to ' +
          'salary and bonus calculations. Evaluation runs automatically in the system, without manual scoring.',
      },
    ],
    audit: {
      title: 'Review of your current system',
      body:
        'On the back end we check data flows and functions and remove unnecessary load. On the front end we ' +
        'propose clearer user screens and cut out extra steps.',
    },
  },
  products: {
    title: 'Products',
    lead: 'Alongside client projects, we have built systems of our own from what we learned in the field.',
    visit: (label) => `Visit ${label}`,
    items: [
      {
        key: 'khurgan',
        name: 'Khurgan Zeel',
        status: 'live',
        statusLabel: 'In use',
        summary:
          'Loan management system for non-bank financial institutions and small lenders. ' +
          'Everything from issuing a loan to repayments and reports, in one place.',
        features: [
          'Issue, extend and close loans, track due dates',
          'Overdue loans and risk lists',
          'Customer, contract and collateral records',
          'Cash journal, bank statements, financial reports',
          'Scheduled and bulk SMS notifications',
        ],
        link: { href: KHURGAN_URL, label: 'khurganzeel.mn' },
      },
      {
        key: 'basketball',
        name: 'Basketball team management and analytics system',
        status: 'live',
        statusLabel: 'Completed',
        summary:
          'Brings a club’s day-to-day team management and game analysis into one system. Turns player, ' +
          'practice and game data into the statistics coaches need to make decisions.',
        features: [
          'Player and coach records, contracts',
          'Practice and game schedules',
          'Game and player statistics and analysis',
          'Injury and health tracking',
        ],
      },
      {
        key: 'tasks',
        name: 'Task management system',
        status: 'live',
        statusLabel: 'Completed',
        summary:
          'Plan a team’s work as tasks and track owners, deadlines and progress in one place. ' +
          'Connects to KPI evaluation and calculates performance automatically.',
        features: [
          'Create tasks, assign owners and deadlines',
          'Track progress on a kanban board or as a list',
          'Link performance to KPI evaluation',
        ],
      },
    ],
    loanPreview: {
      title: 'Loans',
      count: '4 loans',
      rows: [
        { who: 'B. Enkhtuya', amount: '3,500,000₮', state: 'Current', tone: 'ok' },
        { who: 'G. Temuulen', amount: '1,200,000₮', state: '12 days overdue', tone: 'late' },
        { who: 'D. Sarangerel', amount: '5,000,000₮', state: 'Extended', tone: 'ext' },
        { who: 'O. Batbayar', amount: '800,000₮', state: 'Current', tone: 'ok' },
      ],
    },
    board: [
      { col: 'To do', cards: ['Report template', 'User roles'] },
      { col: 'In progress', cards: ['KPI link'] },
      { col: 'Done', cards: ['Board view', 'Alerts'] },
    ],
  },
  experience: {
    title: 'Experience',
    lead:
      'Over the past 10 years we have mainly implemented loan systems and ERP for non-bank financial ' +
      'institutions, manufacturers and retailers.',
    timeline: [
      {
        year: '2016',
        text: 'Implemented the Grape City core loan system at Bichil Globus.',
        logo: LOGOS.grape,
        alt: 'Grape City',
      },
      {
        year: '2017',
        text: 'Mapped business processes across the group, researched a suitable ERP system and drew up the development plan.',
        logo: LOGOS.bichil,
        alt: 'Bichil Globus',
      },
      {
        year: '2018',
        text: 'Initiated the Sono fintech project and fully prepared its research, requirements and plan.',
      },
      { year: '2019', text: 'The Sono app launched on June 19.' },
      {
        year: '2020',
        text: 'Implemented a core loan system and a lending app at GSP NBFI.',
        logo: LOGOS.gsb,
        alt: 'GSB Capital',
      },
      { year: '2021', text: 'Started the M Credit lending app project and delivered its development.' },
      {
        year: '2022',
        text: 'Customized and implemented Ultimate ERP for APU JSC subsidiaries SBB Trade, APU Trade and APU Dairy.',
        logo: LOGOS.apu,
        alt: 'APU',
      },
      {
        year: '2023',
        text: 'Customized and implemented Ultimate ERP at Talkh Chikher JSC.',
        logo: LOGOS.talh,
        alt: 'Talkh Chikher',
      },
      {
        year: '2024',
        text: 'Founded Merchant Commerce LLC and began delivering projects entirely with our own team.',
        logo: LOGOS.mcommerce,
        alt: 'M Commerce',
      },
      { year: '2025', text: 'Launched Khurgan Zeel, a loan system for small lenders.' },
    ],
  },
  team: {
    title: 'Team',
    quote:
      'A new idea for growing a business can come from anywhere. What sets our team apart is turning it ' +
      'into a working part of the business and seeing it through to results.',
    members: [
      { ...PEOPLE[0], initials: PEOPLE[0].initialsEn, name: 'V. Baldandorj', role: 'Founder, business analyst' },
      { ...PEOPLE[1], initials: PEOPLE[1].initialsEn, name: 'B. Munkhzaya', role: 'Project manager, UI/UX analyst' },
    ],
  },
  contact: {
    title: 'Book a meeting',
    lead: 'Tell us briefly about your business. We will get in touch to set a time to meet.',
    address: 'Address',
    email: 'Email',
    phone: 'Phone',
  },
  form: {
    kindLegend: 'Booking as',
    company: 'Company',
    person: 'Individual',
    name: 'Your name',
    regnoCompany: 'Company registration no.',
    regnoPerson: 'National registration no.',
    phone: 'Phone',
    email: 'Email',
    message: 'About your business (optional)',
    messagePlaceholder: 'What problem do you want to solve, and which system are you interested in?',
    submit: 'Send request',
    sending: 'Sending…',
    errors: {
      name: 'Enter your name.',
      regnoCompany: 'Enter your company registration number.',
      regnoPerson: 'Enter your registration number.',
      phone: 'Enter a phone number with at least 8 digits.',
      email: 'Enter a valid email address, for example name@company.com',
    },
    fallbackBefore: 'Your request could not be sent right now.',
    fallbackLink: 'Send it by email',
    fallbackAfter: 'or call us instead.',
    doneTitle: 'Request sent',
    doneBody: 'We will contact you by phone or email to set a meeting time.',
    again: 'Send another request',
    mail: {
      subject: (name) => `Meeting request — ${name}`,
      name: 'Name',
      regnoCompany: 'Company registration no.',
      regnoPerson: 'National registration no.',
      phone: 'Phone',
      email: 'Email',
    },
  },
};

// Процессын алхмуудад эгнээний байрлалыг холбоно.
[mn, en].forEach((c) => {
  c.process.nodes = c.process.steps.map((label, i) => ({ label, lane: STEP_LANES[i] }));
});

export const CONTENT = { mn, en };
