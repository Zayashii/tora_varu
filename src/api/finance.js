import { fetchWithRetry } from 'src/utils/axios';
import { endpoints } from 'src/utils/axios';

// Журнал жагсаалт
export const getMoneyJournalList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.finance.moneyJournalList, params, loginFn });


//Дансны хуулга жагсаалт
export const getStatementList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.finance.statementList, params, loginFn });

//тухайн зээлийн хаах болон сунгах дүнг авах
export const getLoanInfoByLoanCode = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.finance.getLoanAmount, params, loginFn });


// Дансны хуулгаас баталгаажуулах
export const confirmAccountStatement = (data, loginFn) =>
    fetchWithRetry({ method: 'post', url: endpoints.finance.confirmStatement, data, loginFn });

// excel-р хуулга оруулах
export async function importStatementByExcel(formData, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.finance.importStatement,
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

// Буцаасан журнал жагсаалт
export const getReturnedJournal = (params, loginFn) =>
  fetchWithRetry({ method: 'get', url: endpoints.finance.getCanceledJournal, params, loginFn });


// Буцаах
export const returnJournal = (data, loginFn) =>
  fetchWithRetry({ method: 'post', url: endpoints.finance.cancelJournal, data, loginFn });
