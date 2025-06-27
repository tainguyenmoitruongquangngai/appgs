export const API_MESSAGES = {
  // Thông báo chung
  LOADING: "Đang tải dữ liệu...",
  NO_DATA: "Không có dữ liệu",

  // Thông báo CRUD
  GET_SUCCESS: "Lấy dữ liệu thành công",
  GET_ERROR: "Không thể lấy dữ liệu",

  CREATE_SUCCESS: "Thêm mới thành công",
  CREATE_ERROR: "Không thể thêm mới",

  UPDATE_SUCCESS: "Cập nhật thành công",
  UPDATE_ERROR: "Không thể cập nhật",

  DELETE_SUCCESS: "Xóa thành công",
  DELETE_ERROR: "Không thể xóa",
  DELETE_CONFIRM: "Bạn có chắc chắn muốn xóa?",

  // Thông báo tải lên
  UPLOAD_SUCCESS: "Tải lên thành công",
  UPLOAD_ERROR: "Không thể tải lên dữ liệu",

  // Thông báo xác thực
  LOGIN_SUCCESS: "Đăng nhập thành công",
  LOGIN_ERROR: "Đăng nhập thất bại",
  LOGOUT_SUCCESS: "Đăng xuất thành công",
  SESSION_EXPIRED: "Phiên làm việc đã hết hạn",

  // Thông báo quyền truy cập
  FORBIDDEN: "Bạn không có quyền truy cập",

  // Thông báo kết nối
  CONNECTION_ERROR: "Lỗi kết nối, vui lòng thử lại",
  SERVER_ERROR: "Lỗi máy chủ, vui lòng thử lại sau",

  // Các thông báo module cụ thể
  ROLE: {
    CREATE_SUCCESS: "Tạo nhóm người dùng thành công",
    UPDATE_SUCCESS: "Cập nhật nhóm người dùng thành công",
    DELETE_SUCCESS: "Xóa nhóm người dùng thành công",
    ASSIGN_SUCCESS: "Phân quyền thành công",
  },
  USER: {
    CREATE_SUCCESS: "Tạo người dùng thành công",
    UPDATE_SUCCESS: "Cập nhật thông tin người dùng thành công",
    DELETE_SUCCESS: "Xóa người dùng thành công",
    PASSWORD_CHANGE_SUCCESS: "Thay đổi mật khẩu thành công",
    PASSWORD_CHANGE_ERROR: "Thay đổi mật khẩu thất bại",
  },
  DASHBOARD: {
    CREATE_SUCCESS: "Tạo trang thành công",
    UPDATE_SUCCESS: "Cập nhật trang thành công",
    DELETE_SUCCESS: "Xóa trang thành công",
  },
};
