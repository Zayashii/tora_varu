import { fetchWithRetry } from "src/utils/axios";
import { endpoints, axiosForForeign } from "src/utils/axios";

// Хэрэглэгчийн жагсаалт
export const getConsumerList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.finance.consumerList, params, loginFn });

// Файл жагсаалт
export const getFileList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.finance.fileList, params, loginFn });

// Файл хадгалах
export const uploadBannerImage = (formData, loginFn) =>
    fetchWithRetry({
        method: 'post',
        url: endpoints.finance.uploadFile,
        data: formData,
        config: {
            headers: { 'Content-Type': 'multipart/form-data' }
        },
        loginFn
    });

// Файл устгах
export const deleteBannerImage = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.finance.deleteFile, params, loginFn });

// Асуулт хариулт жагсаалт
export const getQuestionAndAnswerList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.board.getFaq, params, loginFn });

// Асуулт устгах
export const deleteQuestion = (data, loginFn) =>
    fetchWithRetry({ method: 'post', url: endpoints.board.deleteFaq, data, loginFn });

// Асуулт хариулт засах
export const updateQuestionAnswers = (data, loginFn) =>
    fetchWithRetry({ method: 'post', url: endpoints.board.saveFaq, data, loginFn });

// Компани жагсаалт
export const getCompanyList = (params, loginFn) =>
    fetchWithRetry({ method: 'get', url: endpoints.company.getList, params, loginFn });

// Компани нэмэх, засах
export const addEditCompany = (formData, loginFn) =>
    fetchWithRetry({
        method: 'post',
        url: endpoints.company.add,
        data: formData,
        config: {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': 'W3m*Rk92Tp!sY81qHv4@Cf07Bn#xG5Lz'
            }
        },
        loginFn
    })

// Гадны API - Компани нэр
export const getCompanyName = async (rd) => {
    const url = `https://info.ebarimt.mn/rest/merchant/info?regno=${rd}`;
    const response = await axiosForForeign.get(url);
    return response.data;
};

