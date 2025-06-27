import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../constants/ApiURL";
import { API_MESSAGES } from "../constants/message";

// React Native compatible types
type AlertColor = "success" | "error" | "warning" | "info";

// ======= TYPES =======
interface LoadingHandlers {
  show: () => void;
  hide: () => void;
}

interface NotificationHandlers {
  showMessage: (message: string, severity: AlertColor, options?: any) => void;
}

type ApiMethod = "get" | "post" | "put" | "delete";

// ======= CONTEXT HANDLERS =======
let loadingHandlers: LoadingHandlers | null = null;
let notificationHandlers: NotificationHandlers | null = null;

// Inject loading handlers từ LoadingContext
export function injectLoading(handlers: LoadingHandlers) {
  loadingHandlers = handlers;
}

// Inject notification handlers từ NotificationContext
export function injectNotification(handlers: NotificationHandlers) {
  notificationHandlers = handlers;
}

// ======= UTILITY FUNCTIONS =======
const showLoading = () => {
  if (loadingHandlers) loadingHandlers.show();
};

const hideLoading = () => {
  if (loadingHandlers) loadingHandlers.hide();
};

const showNotification = (
  message: string,
  severity: AlertColor,
  options?: any
) => {
  if (notificationHandlers) {
    notificationHandlers.showMessage(message, severity, options);
  }
};

// API thông báo helper
export const apiMessages = {
  success: (message: string, options?: any) =>
    showNotification(message, "success", options),
  error: (message: string, options?: any) =>
    showNotification(message, "error", options),
  info: (message: string, options?: any) =>
    showNotification(message, "info", options),
  warning: (message: string, options?: any) =>
    showNotification(message, "warning", options),
};

// ======= AXIOS CONFIG =======
// Thiết lập interceptor để xử lý lỗi chung
axios.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    hideLoading();

    // Format error message
    let errorMessage = "Đã xảy ra lỗi khi xử lý yêu cầu";

    if (error.response) {
      // Server returned an error response
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data && error.response.data.title) {
        errorMessage = error.response.data.title;
      } else if (error.response.status === 401) {
        errorMessage = API_MESSAGES.SESSION_EXPIRED;
      } else if (error.response.status === 403) {
        errorMessage = API_MESSAGES.FORBIDDEN;
      } else if (error.response.status === 404) {
        errorMessage = "Không tìm thấy dữ liệu yêu cầu";
      } else if (error.response.status >= 500) {
        errorMessage = API_MESSAGES.SERVER_ERROR;
      }
    } else if (error.request) {
      // Request was made but no response
      errorMessage = API_MESSAGES.CONNECTION_ERROR;
    }

    // Chỉ hiển thị thông báo lỗi nếu không phải là 401 (khi đã tự chuyển hướng)
    if (!(error.response && error.response.status === 401)) {
      apiMessages.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// ======= CORE API FUNCTIONS =======

/**
 * Hàm cơ bản để thực hiện các request API
 * @param method HTTP method
 * @param endpoint Endpoint API
 * @param data Dữ liệu request (body)
 * @param options Tùy chọn request bổ sung
 * @param useGlobalLoading Sử dụng loading toàn cục
 * @returns Promise với dữ liệu trả về hoặc null nếu có lỗi
 */
export async function requestData(
  method: ApiMethod,
  endpoint: string,
  data?: any,
  options?: AxiosRequestConfig,
  useGlobalLoading = true
): Promise<any | null> {
  if (useGlobalLoading) {
    showLoading();
  }

  try {
    const token = await AsyncStorage.getItem("authToken");
    const config: AxiosRequestConfig = {
      url: `${API_BASE_URL}/${endpoint}`,
      method: method,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        ...(options?.headers || {}),
      },
      ...options,
    };

    // Add data to request based on method
    if (["post", "put", "patch"].includes(method)) {
      // Process DateTime fields to add UTC+7 timezone
      config.data = adjustDateTimeValues(data);
    } else if (data && !options?.params) {
      // For GET requests, process query params too
      config.params = adjustDateTimeValues(data);
    }

    const response = await axios(config);
    if (useGlobalLoading) {
      hideLoading();
    }

    return response.data;
  } catch (error) {
    // Error already handled by axios interceptor
    if (useGlobalLoading) {
      hideLoading();
    }

    return null;
  }
}

/**
 * Điều chỉnh các giá trị DateTime trong dữ liệu để thêm múi giờ +7
 * @param data Dữ liệu cần kiểm tra và điều chỉnh
 * @returns Dữ liệu đã được điều chỉnh múi giờ
 */
function adjustDateTimeValues(data: any): any {
  if (!data) return data;

  if (data instanceof Date) {
    // Thêm múi giờ +7 cho giá trị Date
    const offset = "+07:00"; // Múi giờ Việt Nam (UTC+7)
    return new Date(data.getTime() - data.getTimezoneOffset() * 60000)
      .toISOString()
      .replace("Z", offset);
  }

  if (Array.isArray(data)) {
    // Xử lý mảng
    return data.map((item) => adjustDateTimeValues(item));
  }

  if (typeof data === "object" && data !== null) {
    // Xử lý object
    const result = { ...data };
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = adjustDateTimeValues(result[key]);
      }
    }
    return result;
  }

  // Trả về các loại dữ liệu nguyên thủy khác không thay đổi
  return data;
}

// ======= CONVENIENCE API FUNCTIONS =======

/**
 * Lấy dữ liệu từ API
 * @param endpoint Endpoint API
 * @param params Tham số query (tùy chọn)
 * @param options Tùy chọn request bổ sung
 * @param useGlobalLoading Sử dụng loading toàn cục
 * @returns Dữ liệu từ API
 */
export async function getData(
  endpoint: string,
  params?: any,
  options?: AxiosRequestConfig,
  useGlobalLoading = true
) {
  const requestOptions = { ...options, params };

  return requestData("get", endpoint, null, requestOptions, useGlobalLoading);
}

/**
 * Tạo dữ liệu mới
 * @param endpoint Endpoint API
 * @param data Dữ liệu cần tạo
 * @param successMessage Thông báo thành công (tùy chọn)
 * @param useGlobalLoading Sử dụng loading toàn cục
 * @returns Dữ liệu được tạo từ API
 */
export async function saveData(
  endpoint: string,
  data: any,
  successMessage?: string,
  useGlobalLoading = true
) {
  const response = await requestData(
    "post",
    endpoint,
    data,
    undefined,
    useGlobalLoading
  );
  if (response) {
    apiMessages.success(successMessage || API_MESSAGES.CREATE_SUCCESS);
  }
  return response;
}

/**
 * Cập nhật dữ liệu hiện có
 * @param endpoint Endpoint API
 * @param data Dữ liệu cần cập nhật
 * @param successMessage Thông báo thành công (tùy chọn)
 * @param useGlobalLoading Sử dụng loading toàn cục
 * @returns Dữ liệu sau khi cập nhật
 */
export async function updateData(
  endpoint: string,
  data: any,
  successMessage?: string,
  useGlobalLoading = true
) {
  const response = await requestData(
    "put",
    endpoint,
    data,
    undefined,
    useGlobalLoading
  );
  if (response) {
    apiMessages.success(successMessage || API_MESSAGES.UPDATE_SUCCESS);
  }
  return response;
}

/**
 * Xóa dữ liệu
 * @param endpoint Endpoint API
 * @param successMessage Thông báo thành công (tùy chọn)
 * @param useGlobalLoading Sử dụng loading toàn cục
 * @returns Kết quả từ API
 */
export async function deleteData(
  endpoint: string,
  successMessage?: string,
  useGlobalLoading = true
) {
  const response = await requestData(
    "delete",
    endpoint,
    null,
    undefined,
    useGlobalLoading
  );
  if (response) {
    apiMessages.success(successMessage || API_MESSAGES.DELETE_SUCCESS);
  }
  return response;
}

/**
 * Upload file lên server
 * @param file File object (từ input type="file")
 * @param filePath Thư mục lưu file trên server (ví dụ: 'hoso/123')
 * @param fileName Tên file lưu trên server (nếu không truyền sẽ lấy tên gốc)
 * @param useGlobalLoading Có sử dụng loading toàn cục không
 * @returns Promise<{FilePath: string} | null> Đường dẫn file sau khi upload hoặc null nếu lỗi
 */
export async function uploadFile(
  file: File,
  filePath: string,
  fileName?: string,
  useGlobalLoading = true
) {
  const formData = new FormData();
  formData.append("File", file);
  formData.append("FilePath", filePath);
  formData.append("FileName", fileName || file.name);

  const options = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await requestData(
    "post",
    "file/upload",
    formData,
    options,
    useGlobalLoading
  );

  if (response) {
    apiMessages.success(API_MESSAGES.UPLOAD_SUCCESS || "Tải lên thành công");
  }

  return response;
}
