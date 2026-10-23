import { fetchWithRetry } from 'src/utils/axios';
import { endpoints } from 'src/utils/axios';


//Dashboard Зээлийн мэдээлэл
export const getLoanInfo = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.dashboard.loan, params, loginFn });


//Dashboard Авлагын мэдээлэл
export const getReceivableInfo = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.dashboard.receivable, params, loginFn });


//Dashboard Авлагын мэдээлэл(Урьдчилсан хүүгийн орлого)
export const getRevenue = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.dashboard.revenue, params, loginFn });


//Dashboard Харилцагчийн мэдээлэл
export const getUserInfoList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.dashboard.userInfoList, params, loginFn });


//Харилцагчийн жагсаалт
export const getUserList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.dashboard.userList, params, loginFn });


//Exp Table
export const expDashboardTable = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.dashboard.expTable, params, loginFn });

//Exp Graph
export const expDashboardGraph = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.dashboard.expGraph + params, loginFn });