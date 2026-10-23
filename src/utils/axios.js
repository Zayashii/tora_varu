import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API, timeout: 120000 });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const axiosForForeign = axios.create();

// ----------------------------------------------------------------------

export const fetchWithRetry = async ({
  method = "get",
  url,
  params,
  data,
  config = {},
  loginFn
}) => {
  const fetchData = async () => {
    if (method === "get") {
      return await axiosInstance.get(url, { params, ...config });
    } else if (method === "post") {
      return await axiosInstance.post(url, data, { params, ...config });
    }
  };

  let response = await fetchData();

  if (response?.data?.rettype === 1 && response?.data?.retdesc === "Дахин нэвтэрнэ үү!") {
    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");

    if (username && password && typeof loginFn === "function") {
      const { isSuccess } = await loginFn(username, password);
      if (isSuccess) {
        response = await fetchData(); // Retry once after login
      }
    }
  }

  return {
    success: response?.data?.rettype === 0,
    msg: response?.data?.retdesc,
    data: response?.data?.retdata
  };
};
// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  bankList: '/Admin/GetBankList',
  auth: {
    me: '/api/auth/me',
    login: '/Admin/Login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  dashboard: {
    loan: '/Admin/GetLoanInfo',
    receivable: '/Admin/GetApInfo',
    revenue: '/Admin/GetApInfoFuture',
    userInfoList: '/Admin/GetDataInfo',
    userList: '/Admin/GetData',
    expTable: '/Admin/GetDashboardExpTable',
    expGraph: '/Admin/GetDashboardExpGrapic',
  },
  user: {
    bankList: '/Admin/GetBankList',
    productList: '/Admin/GetProducts',
    createProduct: '/Admin/AddProducts',
    createUser: '/Admin/AddData',
    editUser: '/Admin/UpdateData',
    loanHistory: '/Admin/GetZeelHistory',
    getUserDetail: '/Admin/GetDataDtl',
    addNote: '/Admin/AddNote',
    getNote: '/Admin/GetNote',
    importExcel: '/Admin/AddDataExcel',
    getOTPPassword: '/Admin/GetOTPPassword',
    validateOtp: '/Admin/ValidateOtp',
    changePass: '/Admin/ChangePass',
  },
  loan: {
    list: '/Admin/GetZeelList',
    expired: '/Admin/GetExpZeelList',
    risked: '/Admin/GetRiskList',
    importExcel: '/Admin/AddZeelExcel',
    control: '/Admin/GetControlEnddate',
    giveZeel: '/Admin/GiveZeel',
    setZeelRiskDate: '/Admin/SetZeelRiskDate',
  },
  finance: {
    moneyJournalList: '/Admin/GetJournal',
    statementList: '/Admin/GetStatement',
    getLoanAmount: '/Admin/GetZeelAmounts',
    confirmStatement: '/Admin/ModStatement',
    consumerList: '/Admin/GetUser',
    fileList: '/Admin/Getfiles',
    uploadFile: '/Admin/UploadFile',
    deleteFile: '/Admin/DeleteFile',
    importStatement: '/Admin/AddHuulgaExcel',
  },
  board: {
    getFaq: '/Admin/GetFaq',
    deleteFaq: '/Admin/DeleteFaq',
    saveFaq: '/Admin/SaveFaq',
  },
  company: {
    getList: '/Admin/GetCompany',
    add: '/Admin/AddCompany',
  },
  collateral: {
    type: {
      list: '/Admin/GetCollateType',
      add: '/Admin/AddCollateType',
    },
    list: '/Admin/GetCollate',
    add: '/Admin/AddCollate',
    importExcel: '/Admin/AddCollateExcel',
  },
  report: {
    ct: '/Admin/GetCT',
    znd: '/Admin/GetZND',
  },
  register: {
    company: '/Admin/AddCompany',
    user: '/Admin/UserRegister',
  },
  subs: {
    get: '/Admin/GetSubscription',
    select: '/Admin/GetSubQPay',
    check: '/Admin/CheckSubPaid',
    subinfo: '/Admin/GetSubscriptionInfo',
  },
  constant: '/Admin/GetConstants',
  message: {
    add: '/Admin/AddMsg',
    get: '/Admin/GetMsgs',
  }
};
