import { fetchWithRetry } from "src/utils/axios";
import { endpoints } from "src/utils/axios";

// bank жагсаалт
export async function getBankList(params, loginFn) {
    const response = await fetchWithRetry({
        method: "get",
        url: endpoints.user.bankList,
        params,
        loginFn
    });

    console.log("response getBankList -> ", response);
    return {
        success: response.success,
        msg: response.msg,
        data: response.data?.banklist ?? []
    };
}

// product жагсаалт
export async function getProductList(params, loginFn) {
    const response = await fetchWithRetry({
        method: "get",
        url: endpoints.user.productList,
        params,
        loginFn
    });

    console.log("response getProductList -> ", response);
    return {
        success2: response.success,
        msg2: response.msg,
        data2: response.data ?? []
    };
}

// шинэ хэрэглэгч нэмэх
export async function addNewUser(formData, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.user.createUser,
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

// хэрэглэгч засах
export async function editNewUser(formData, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.user.editUser,
        data: formData,
        loginFn
    });

    console.log("response editNewUser -> ", response);
    return {
        success: response.success,
        msg: response.msg,
        data: response.msg
    };
}

// product нэмэх
export async function addNewProduct(body, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.user.createProduct,
        data: body,
        loginFn
    });

    console.log("response addNewProduct -> ", response);
    return {
        success: response.success,
        msg: response.msg,
        data: response.msg
    };
}

// Зээлийн түүхийн жагсаалт
export async function getLoanHistoryList(params, loginFn) {
    const response = await fetchWithRetry({
        method: "get",
        url: endpoints.user.loanHistory,
        params,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data?.loanhistory ?? []
    };
}


// id-р харилцагчийн мэдээлэл авах
export async function getUserDataById(params, loginFn) {
    const response = await fetchWithRetry({
        method: "get",
        url: endpoints.user.getUserDetail,
        params,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? ""
    };
}

// Тэмдэглэл оруулах
export async function addNote(body, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.user.addNote,
        data: body,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? ""
    };
}

// Тэмдэглэл жагсаалт
export async function getNotes(params, loginFn) {
    const response = await fetchWithRetry({
        method: "get",
        url: endpoints.user.getNote,
        params,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? []
    };
}

// excel-р оруулах
export async function importUserByExcel(formData, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.user.importExcel,
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


// Company burtguuleh
export async function registerCompany(body, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.register.company,
        data: body,
        config: {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': 'W3m*Rk92Tp!sY81qHv4@Cf07Bn#xG5Lz'
            }
        },
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? ""
    };
}

// Huvi hun burtguuleh
export async function registerIndividual(body, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.register.user,
        data: body,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? ""
    };
}


// тогтмол авах
export const getConstant = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.constant, params, loginFn });

// Мессеж нэмэх
export async function addMessage(body, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.message.add,
        data: body,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? ""
    };
}

// Мессеж жагсаалт
export async function getMsgs(params, loginFn) {
    const response = await fetchWithRetry({
        method: "get",
        url: endpoints.message.get,
        params,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? []
    };
}


// Нууц үг сэргээх код авах
export async function GetOTPPassword(params, loginFn) {
    const response = await fetchWithRetry({
        method: "get",
        url: endpoints.user.getOTPPassword,
        params,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? []
    };
}

// OTP баталгаажуулах
export async function ValidateOtp(body, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.user.validateOtp,
        data: body,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? []
    };
}

// Нууц үг солих
export async function ChagnePassword(body, loginFn) {
    const response = await fetchWithRetry({
        method: "post",
        url: endpoints.user.changePass,
        data: body,
        loginFn
    });

    return {
        success: response.success,
        msg: response.msg,
        data: response.data ?? []
    };
}