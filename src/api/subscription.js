import { fetchWithRetry } from "src/utils/axios";
import { endpoints } from "src/utils/axios";


export const getSubs = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.subs.get, params, loginFn });


export const getSubQpay = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.subs.select, params, loginFn });

export const checkSubQpay = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.subs.check, params, loginFn });

export const getSubDesc = async (params, loginFn) => {
    const { success, msg, data } = await fetchWithRetry({ method: 'get', url: endpoints.subs.subinfo, params, loginFn });
    return { success2: success, msg2: msg, data2: data };
}
