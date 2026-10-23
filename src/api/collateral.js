import { fetchWithRetry } from "src/utils/axios";
import { endpoints } from "src/utils/axios";


export const getCollateralTypes = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.collateral.type.list, params, loginFn });


export const addCollateralType = (data, loginFn) =>
    fetchWithRetry({ method: 'post', url: endpoints.collateral.type.add, data, loginFn });


export async function addCollateral(formData, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.collateral.add,
        data: formData,
        loginFn
    });

    console.log("response addNewUser -> ", response);
    return {
        success: response.success,
        msg: response.msg,
        data: response.msg
    };
}

export const getCollaterals = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.collateral.list, params, loginFn });


// excel-р оруулах
export async function importCollateralByExcel(formData, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.collateral.importExcel,
        data: formData,
        loginFn
    });

    console.log("response addNewUser -> ", response);
    return {
        success: response.success,
        msg: response.msg,
        data: response.msg
    };
}