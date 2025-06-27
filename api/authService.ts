import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../constants/ApiURL";
import {
  getData,
  saveData,
  updateData,
  deleteData,
  apiMessages,
} from "./index";
import { API_MESSAGES } from "../constants/message";

// ======================== TYPES ========================
export interface PageResponse<T> {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
}

export interface FormFilterUser {
  pageNumber?: number;
  pageSize?: number;
  userName?: string;
}

// Login DTO (LoginViewDto)
export interface LoginDto {
  userName: string;
  password: string;
  rememberMe?: boolean;
}

// Register DTO (RegisterDto is not in backend, keep as is if needed)
export interface RegisterDto {
  username: string;
  email?: string;
  fullName?: string;
  password: string;
}

// UserDto (from backend) - matching exactly with backend DTO
export interface UserDto {
  id?: string;
  userName?: string;
  password?: string;
  confirmPassword?: string;
  lastPasswordChangedDate?: Date;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  permission?: PermissionDto[];
  dashboards?: DashboardDto[];
  businessId?: number;
  constructionId?: number;
}

// PasswordChange (from backend) - matching exactly with backend DTO
export interface PasswordChangeDto {
  currentPassword: string;
  newPassword: string;
  newConfirmPassword: string;
}

// PasswordChangeResult (from backend)
export interface PasswordChangeResult {
  succeeded: boolean;
  message?: string;
}

// AssignRoleDto (from backend) - matching exactly with backend DTO
export interface AssignRoleDto {
  userId: string;
  roleName: string;
}

// PermissionDto (from backend)
export interface PermissionDto {
  id: number;
  userName?: string;
  userId?: string;
  roleId?: string;
  roleName?: string;
  dashboardId: number;
  dashboardName?: string;
  dashboardPath?: string;
  functionId: number;
  functionName?: string;
  functionCode?: string;
  status?: boolean;
}

// PermsDto (from backend)
export interface PermsDto {
  dashboardPath: string;
  actions: { [key: string]: boolean };
}

// PermissionMapDto (from backend)
export interface PermissionMapDto {
  path: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

// DashboardDto (from backend) - matching exactly with backend DTO
export interface DashboardDto {
  id: number;
  module: string;
  name: string;
  path: string;
  pathKey: string;
  permitAccess: boolean;
  functions?: FunctionDto[];
}

// FunctionDto (from backend) - matching exactly with backend DTO
export interface FunctionDto {
  id: number;
  permitCode?: string;
  permitName?: string;
  description?: string;
  isAllowed: boolean;
  status: boolean;
}

// DashboardPermissionDto (from backend) - matching exactly with backend DTO
export interface DashboardPermissionDto {
  dashboardName: string;
  dashboardPath: string;
  actions: PermissionMapDto;
}

// RoleDto (from backend) - matching exactly with backend DTO
export interface RoleDto {
  id?: string;
  name: string;
  isDefault: boolean;
  dashboards?: DashboardDto[];
}

// UserDashboardDto (from backend)
export interface UserDashboardDto {
  id: number;
  userId?: string;
  userName?: string;
  dashboardId: number;
  dashboardName?: string;
  fileControl?: string;
  description?: string;
  permitAccess: boolean;
}

// RoleDashboardDto (from backend)
export interface RoleDashboardDto {
  id: number;
  roleId?: string;
  roleName?: string;
  dashboardId: number;
  dashboardName?: string;
  fileControl?: string;
  permitAccess: boolean;
}

// LoginResponse (from backend LoginResult)
export interface LoginResponse {
  success: boolean;
  token: string;
  permissions: PermsDto[];
}

// ======================== AUTH SERVICE ========================
export class AuthService {
  // ============ AUTH CONTROLLER ============

  /**
   * Đăng ký tài khoản mới
   * POST /api/auth/register
   */
  async register(data: RegisterDto): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      apiMessages.success("Đăng ký thành công");

      return response.status === 201;
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng ký thất bại";
      apiMessages.error(message);

      return false;
    }
  }

  /**
   * Đăng nhập
   * POST /api/auth/login
   */
  async login(credentials: LoginDto): Promise<LoginResponse | null> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );

      if (
        response.status === 200 &&
        response.data.success &&
        response.data.token
      ) {
        // Lưu token vào AsyncStorage
        await AsyncStorage.setItem("authToken", response.data.token);
        apiMessages.success(API_MESSAGES.LOGIN_SUCCESS);
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || API_MESSAGES.LOGIN_ERROR;
      apiMessages.error(message);

      return null;
    }
  }

  /**
   * Đổi mật khẩu
   * PUT /api/auth/password
   */
  async changePassword(data: PasswordChangeDto): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.put(`${API_BASE_URL}/auth/password`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      apiMessages.success(API_MESSAGES.USER.PASSWORD_CHANGE_SUCCESS);

      return response.status === 200;
    } catch (error: any) {
      apiMessages.error(
        error.response?.data?.message || API_MESSAGES.USER.PASSWORD_CHANGE_ERROR
      );

      return false;
    }
  }

  /**
   * Đặt lại mật khẩu cho user
   * PUT /api/auth/password/{username}
   */
  async setPassword(username: string, newPassword: string): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.put(
        `${API_BASE_URL}/auth/password/${username}`,
        newPassword, // Gửi string trực tiếp thay vì object { newPassword }
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      apiMessages.success(API_MESSAGES.USER.PASSWORD_CHANGE_SUCCESS);

      return response.status === 200;
    } catch (error: any) {
      apiMessages.error(
        error.response?.data?.message || API_MESSAGES.USER.PASSWORD_CHANGE_ERROR
      );

      return false;
    }
  }

  /**
   * Gán role cho user
   * POST /api/auth/roles
   */
  async assignRole(
    data: AssignRoleDto,
    useGlobalLoading = true
  ): Promise<boolean> {
    try {
      const response = await saveData(
        "auth/roles",
        data,
        "Gán quyền thành công",
        useGlobalLoading
      );

      return response?.succeeded || response?.success || false;
    } catch (error) {
      console.error("Role assignment error:", error);

      return false;
    }
  }

  /**
   * Xóa role khỏi user
   * DELETE /api/auth/roles
   */
  async removeRole(
    data: AssignRoleDto,
    useGlobalLoading = true
  ): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.delete(`${API_BASE_URL}/auth/roles`, {
        headers: { Authorization: `Bearer ${token}` },
        data,
      });
      if (useGlobalLoading) {
        apiMessages.success("Xóa role thành công");
      }

      return response.status === 204;
    } catch (error: any) {
      const message = error.response?.data?.message || "Xóa role thất bại";
      if (useGlobalLoading) {
        apiMessages.error(message);
      }

      return false;
    }
  }

  /**
   * Kiểm tra quyền truy cập
   * GET /api/auth/permissions?userName=...&linkControl=...&action=...
   */
  async checkPermission(
    userName: string,
    linkControl: string,
    action: string
  ): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_BASE_URL}/auth/permissions`, {
        params: { userName, linkControl, action },
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Lấy quyền dashboard của user hiện tại
   * GET /api/auth/user-permissions
   */
  async getCurrentUserPermissions(): Promise<DashboardPermissionDto[]> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        `${API_BASE_URL}/auth/user-permissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Đăng xuất
   * POST /api/auth/logout
   */
  async logout(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await AsyncStorage.removeItem("authToken");
      apiMessages.success("Đăng xuất thành công");

      return true;
    } catch (error) {
      await AsyncStorage.removeItem("authToken");

      return false;
    }
  }

  // ============ USER CONTROLLER ============

  /**
   * Lấy danh sách user với filter
   */
  async getUsers(filter: FormFilterUser): Promise<PageResponse<UserDto>> {
    try {
      const result = await getData("user", filter);

      return (
        result || { items: [], totalItems: 0, pageNumber: 1, pageSize: 10 }
      );
    } catch (error) {
      return { items: [], totalItems: 0, pageNumber: 1, pageSize: 10 };
    }
  }

  /**
   * Lấy user theo ID
   */
  async getUserById(
    userId: string,
    useGlobalLoading = true
  ): Promise<UserDto | null> {
    try {
      const result = await getData(
        `user/${userId}`,
        null,
        undefined,
        useGlobalLoading
      );

      return result || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Lấy thông tin chi tiết user
   */
  async getUserInfo(
    userId: string,
    useGlobalLoading = true
  ): Promise<UserDto | null> {
    try {
      const response = await getData(
        `user/${userId}`,
        null,
        undefined,
        useGlobalLoading
      );

      return response || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Tạo user mới
   */
  async createUser(user: UserDto, useGlobalLoading = true): Promise<boolean> {
    try {
      const result = await saveData(
        "user",
        user,
        API_MESSAGES.USER.CREATE_SUCCESS,
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cập nhật user
   */
  async updateUser(
    userId: string,
    user: UserDto,
    useGlobalLoading = true
  ): Promise<boolean> {
    try {
      const result = await updateData(
        `user/${userId}`,
        user,
        API_MESSAGES.USER.UPDATE_SUCCESS,
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Xóa user
   */
  async deleteUser(userId: string, useGlobalLoading = true): Promise<boolean> {
    try {
      const result = await deleteData(
        `user/${userId}`,
        API_MESSAGES.USER.DELETE_SUCCESS,
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  // ============ ROLE CONTROLLER ============

  /**
   * Lấy tất cả roles
   */
  async getRoles(useGlobalLoading = true): Promise<RoleDto[]> {
    const result = await getData("role", null, undefined, useGlobalLoading);

    return result || [];
  }

  /**
   * Lấy role theo ID
   */
  async getRoleById(roleId: string): Promise<RoleDto | null> {
    try {
      const result = await getData(`role/${roleId}`);

      return result || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Tạo role mới
   */
  async createRole(
    roleData: RoleDto,
    useGlobalLoading = true
  ): Promise<boolean> {
    try {
      const result = await saveData(
        "role",
        roleData,
        API_MESSAGES.ROLE.CREATE_SUCCESS,
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cập nhật role
   */
  async updateRole(
    roleData: RoleDto,
    useGlobalLoading = true
  ): Promise<boolean> {
    try {
      if (!roleData.id) {
        apiMessages.error("ID nhóm người dùng không hợp lệ");

        return false;
      }

      const result = await updateData(
        `role/${roleData.id}`,
        roleData,
        API_MESSAGES.ROLE.UPDATE_SUCCESS,
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Xóa role
   */
  async deleteRole(roleId: string): Promise<boolean> {
    try {
      const result = await deleteData(
        `role/${roleId}`,
        API_MESSAGES.ROLE.DELETE_SUCCESS
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  // ============ DASHBOARD CONTROLLER ============

  /**
   * Lấy tất cả dashboards
   */
  async getDashboards(): Promise<DashboardDto[]> {
    try {
      const result = await getData("dashboard");

      return result || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Lấy dashboard theo role
   */
  async getDashboardsByRole(roleName: string): Promise<any[]> {
    try {
      const result = await getData(`dashboard/roles/${roleName}`);

      return result || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Lấy dashboard theo user
   */
  async getDashboardsByUser(
    userName: string,
    useGlobalLoading = true
  ): Promise<any[]> {
    try {
      const result = await getData(
        `dashboard/users/${userName}`,
        null,
        undefined,
        useGlobalLoading
      );

      return result || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Lấy dashboard theo ID
   */
  async getDashboardById(id: number): Promise<DashboardDto | null> {
    try {
      const result = await getData(`dashboard/${id}`);

      return result || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Tạo dashboard mới
   */
  async createDashboard(data: any, useGlobalLoading = true): Promise<boolean> {
    try {
      const result = await saveData(
        "dashboard",
        data,
        API_MESSAGES.DASHBOARD.CREATE_SUCCESS,
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cập nhật dashboard
   */
  async updateDashboard(
    id: number,
    data: any,
    useGlobalLoading = true
  ): Promise<boolean> {
    try {
      const result = await updateData(
        `dashboard/${id}`,
        data,
        API_MESSAGES.DASHBOARD.UPDATE_SUCCESS,
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Xóa dashboard
   */
  async deleteDashboard(id: number, useGlobalLoading = true): Promise<boolean> {
    try {
      const result = await deleteData(
        `dashboard/${id}`,
        API_MESSAGES.DASHBOARD.DELETE_SUCCESS,
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Assign dashboard access to a role
   */
  async assignRoleDashboardAccess(data: any): Promise<boolean> {
    try {
      const response = await saveData("RoleDashboard/save", data);

      return response?.succeeded || response?.success || false;
    } catch (error) {
      console.error("Error assigning dashboard access:", error);

      return false;
    }
  }

  /**
   * Remove dashboard access from a role
   */
  async removeRoleDashboardAccess(data: any): Promise<boolean> {
    try {
      const response = await saveData("RoleDashboard/delete", data);

      return response?.succeeded || response?.success || false;
    } catch (error) {
      console.error("Error removing dashboard access:", error);

      return false;
    }
  }

  /**
   * Lưu quyền chức năng với tùy chọn ẩn loading
   */
  async savePermission(data: any, useGlobalLoading = true): Promise<boolean> {
    try {
      const result = await saveData(
        "permission/save",
        data,
        "Gán quyền thành công",
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Xóa quyền chức năng với tùy chọn ẩn loading
   */
  async deletePermission(data: any, useGlobalLoading = true): Promise<boolean> {
    try {
      const result = await saveData(
        "permission/delete",
        data,
        "Xóa quyền thành công",
        useGlobalLoading
      );

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Assign dashboard access to a user
   */
  async assignUserDashboardAccess(
    data: any,
    useGlobalLoading = true
  ): Promise<boolean> {
    try {
      const response = await saveData(
        "userdashboard/save",
        data,
        "Cấp quyền truy cập thành công",
        useGlobalLoading
      );

      return response?.succeeded || response?.success || false;
    } catch (error) {
      console.error("Error assigning user dashboard access:", error);

      return false;
    }
  }

  /**
   * Remove dashboard access from a user
   */
  async removeUserDashboardAccess(
    data: any,
    useGlobalLoading = true
  ): Promise<boolean> {
    try {
      const response = await saveData(
        "userdashboard/delete",
        data,
        "Thu hồi quyền truy cập thành công",
        useGlobalLoading
      );

      return response?.succeeded || response?.success || false;
    } catch (error) {
      console.error("Error removing user dashboard access:", error);

      return false;
    }
  }

  /**
   * Lấy danh sách quyền theo role ID
   */
  async getRolePermissions(
    roleId: string,
    useGlobalLoading = false
  ): Promise<PermissionDto[]> {
    try {
      const result = await getData(
        `role/${roleId}/permissions`,
        null,
        undefined,
        useGlobalLoading
      );

      return result || [];
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      return [];
    }
  }

  // ============ HELPER METHODS ============

  /**
   * Kiểm tra xem user đã đăng nhập chưa
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem("authToken");
    return !!token;
  }

  /**
   * Lấy token hiện tại
   */
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem("authToken");
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
