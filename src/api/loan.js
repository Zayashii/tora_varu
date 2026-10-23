import { fetchWithRetry } from "src/utils/axios";
import { endpoints } from "src/utils/axios";

// Зээлийн жагсаалт
export const getLoanList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.loan.list, params, loginFn });

// Хугацаа хэтэрсэн Зээлийн жагсаалт
export const getExpiredLoanList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.loan.expired, params, loginFn });



// excel-р оруулах
export async function importLoanByExcel(formData, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.loan.importExcel,
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

//Control
export const getControlTableData = (params, loginFn) =>
  fetchWithRetry({ method: 'get', url: endpoints.loan.control + params, loginFn });

// Эрсдсэн зээлийн жагсаалт
export const getRiskedLoanList = (params, loginFn) =>
  fetchWithRetry({ method: 'get', url: endpoints.loan.risked, params, loginFn });

// Банкны жагсаалт
export const getBankList = (params, loginFn) =>
  fetchWithRetry({ method: 'get', url: endpoints.bankList, params, loginFn });

export async function addLoanManually(data, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.loan.giveZeel,
        data: data,
        loginFn
    });

    console.log("response addLoanManually -> ", response);
    return {
        success: response.success,
        msg: response.msg,
        data: response.msg
    };
}

// Эрсдсэн зээлийн огноо зээл дээр нэмэх
export async function addRiskDateOnLoan(body, loginFn) {
  const response = await fetchWithRetry({
    method: "post",
    url: endpoints.loan.setZeelRiskDate,
    loginFn,
    params: body,
    config: {
      headers: { 'Content-Type': 'application/json' }
    },
  });

  console.log("response addRiskDateOnLoan -> ", response);
  return {
    success: response.success,
    msg: response.msg,
    data: response.msg
  };
}
