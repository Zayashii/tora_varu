import { fetchWithRetry } from "src/utils/axios";
import { endpoints } from "src/utils/axios";


// CT
export const ReportCT = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.report.ct, params, loginFn });


// ZND
export const ReportZND = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.report.znd, params, loginFn });