// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  USER: '/user',
  LOAN: '/loan',
  FINANACE: '/finance',
  SETTINGS: '/settings',
  BOARD: '/board',
  COLLATERAL: '/collateral',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/kAYnYYdib0aQPNKZpgJT6J/%5BPreview%5D-Minimal-Web.v5.0.0?type=design&node-id=0%3A1&t=Al4jScQq97Aly0Mn-1',
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      newPassword: `${ROOTS.AUTH}/jwt/new-password`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  addbundle: {
    root: `/add-bundle`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    receivable: `${ROOTS.DASHBOARD}/receivable`,
    exceedLoan: `${ROOTS.DASHBOARD}/exceed-loan`,
    userinfo: `${ROOTS.DASHBOARD}/userinfo`,
    userList: `${ROOTS.DASHBOARD}/userinfo/list`,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      cash: `${ROOTS.DASHBOARD}/user/cash`,
      contract: `${ROOTS.DASHBOARD}/user/contract`,
      cashDetail: (id) => `${ROOTS.DASHBOARD}/user/cash/${id}/detail`,
      contractDetail: (id) => `${ROOTS.DASHBOARD}/user/contract/${id}/detail`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      detail: (id) => `${ROOTS.DASHBOARD}/user/${id}/detail`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
      loanHistory: (id) => `${ROOTS.DASHBOARD}/user/${id}/loan-history`,
    },
    product: {
      root: `${ROOTS.LOAN}/product`,
      new: `${ROOTS.LOAN}/product/new`,
      details: (id) => `${ROOTS.LOAN}/product/${id}`,
      edit: (id) => `${ROOTS.LOAN}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.LOAN}/product/${MOCK_ID}`,
        edit: `${ROOTS.LOAN}/product/${MOCK_ID}/edit`,
      },
    },
    loan: {
      root: `${ROOTS.LOAN}`,
      expiredLoan: `${ROOTS.LOAN}/expired`,
      controlExpiredLoan: `${ROOTS.LOAN}/control`,
      expiredIntervalLoan: (prod_id, interval_id) => `${ROOTS.LOAN}/prod/${prod_id}/interval/${interval_id}`,
      extendLoan: (id) => `${ROOTS.LOAN}/${id}/extend`,
      closeLoan: (id) => `${ROOTS.LOAN}/${id}/close`,
      riskList: `${ROOTS.LOAN}/riskList`,
      createManually: `${ROOTS.LOAN}/createManually`,
    },
    collateral: {
      root: `${ROOTS.COLLATERAL}`,
      new: `${ROOTS.COLLATERAL}/new`,
      type: {
        root: `${ROOTS.COLLATERAL}/type`,
        new: `${ROOTS.COLLATERAL}/type/new`,
      }
    },
    finance: {
      root: `${ROOTS.FINANACE}`,
      statement: `${ROOTS.FINANACE}/statement`,
      returned: `${ROOTS.FINANACE}/returned`,
      report: {
        root: `${ROOTS.FINANACE}/report`,
        znd: `${ROOTS.FINANACE}/report/znd`,
        bd: `${ROOTS.FINANACE}/report/bd`,
        ug: `${ROOTS.FINANACE}/report/ug`,
      }
    },
    settings: {
      root: `${ROOTS.SETTINGS}`,
      newConsumer: `${ROOTS.SETTINGS}/consumer/new`,
      fileList: `${ROOTS.SETTINGS}/file/list`,
      companyList: `${ROOTS.SETTINGS}/company`,
      changePassword: `${ROOTS.SETTINGS}/change-password`,
      newCompany: `${ROOTS.SETTINGS}/company/new`,
      editCompany: (id) => `${ROOTS.SETTINGS}/company/${id}/edit`,
      message: {
        schedule: `${ROOTS.SETTINGS}/message`,
        mass: `${ROOTS.SETTINGS}/message/mass`,
        payment: `${ROOTS.SETTINGS}/message/payment`,
      }
    },
    board: {
      root: `${ROOTS.BOARD}`,
      add: `${ROOTS.BOARD}/faq/new`,
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    }
  },
};
