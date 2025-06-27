import { CT_ThongTinDto } from "./congtrinhService";
import { GP_ThongTinDto } from "./giayphepService";
import { getData, saveData, apiMessages, ToChuc_CaNhanDto } from "./index";

// ======================== TYPES ========================
// Extended DTO for construction information - matching exactly with backend
export interface DataConstructionForTransmissionAccountsDto {
  chu_gp?: string;
  dc_chu_gp?: string;
  email?: string;
  ten_ct?: string;
  ma_ct?: string;
  vi_tri?: string;
  loai_ct?: string;
  x: number;
  y: number;
  license_id?: number;
  license_number?: string;
}

// DataTransmissionAccountsDto - matching exactly with backend
export interface DataTransmissionAccountsDto {
  id?: number;
  username?: string;
  password?: string;
  cameraLink?: string;
  ftpAddress?: string;
  protocol?: string;
  port?: number;
  workingDirectory?: string;
  dataType?: string;
  status?: boolean;
  cong_trinh?: DataConstructionForTransmissionAccountsDto;
}

export interface BusinessConstructionDto {
  construction: CT_ThongTinDto;
  latestLicense: GP_ThongTinDto | null;
  connectionAccount: DataTransmissionAccountsDto | null;
  businessInfo: ToChuc_CaNhanDto; // ToChuc_CaNhanDto
}

// ======================== DATA TRANSMISSION SERVICE ========================
export class DataTransmissionService {
  /**
   * Lấy danh sách tài khoản kết nối dựa theo quyền người dùng
   * - Nếu là Administrator: Tất cả tài khoản
   * - Nếu là Business: Tài khoản cho các công trình doanh nghiệp quản lý
   * - Nếu là Construction: Chỉ tài khoản của user đó
   * GET /tai-khoan-ket-noi/theo-quyen
   */
  async getAccountsByRole(): Promise<DataTransmissionAccountsDto[]> {
    try {
      const result = await getData("tai-khoan-ket-noi/theo-quyen");
      return result || [];
    } catch (error) {
      console.error("Error fetching transmission accounts by role:", error);
      return [];
    }
  }

  /**
   * Lấy danh sách tài khoản kết nối (Admin only)
   * GET /tai-khoan-ket-noi/danh-sach
   */
  async getAll(): Promise<DataTransmissionAccountsDto[]> {
    try {
      const result = await getData("tai-khoan-ket-noi/danh-sach");
      return result || [];
    } catch (error) {
      console.error("Error fetching transmission accounts:", error);
      return [];
    }
  }

  /**
   * Lấy tài khoản kết nối của công trình người dùng
   * GET /tai-khoan-ket-noi/tai-khoan
   */
  async getByUser(): Promise<DataTransmissionAccountsDto | null> {
    try {
      const result = await getData("tai-khoan-ket-noi/tai-khoan");
      return result || null;
    } catch (error) {
      console.error("Error fetching account by user:", error);
      return null;
    }
  }
  /**
   * Tạo tài khoản kết nối mới
   * POST /tai-khoan-ket-noi/luu
   */
  async save(data: Partial<DataTransmissionAccountsDto>): Promise<number> {
    try {
      const result = await saveData("tai-khoan-ket-noi/luu", data);

      // Check if the result has an id and return it
      if (result && result.id) {
        return result.id;
      } else if (result && result.message) {
        // If we get a message without an error flag, consider it a success with a 1 id
        return 1;
      } else {
        // Otherwise return 0 to indicate failure
        console.error("Invalid response from server:", result);
        return 0;
      }
    } catch (error) {
      console.error("Error saving transmission account:", error);
      throw error; // Re-throw to allow proper error handling in components
    }
  }

  /**
   * Kích hoạt tài khoản kết nối
   * GET /tai-khoan-ket-noi/duyet/{id}
   */
  async activate(id: number): Promise<boolean> {
    try {
      const result = await getData(`tai-khoan-ket-noi/duyet/${id}`);
      apiMessages.success("Kích hoạt tài khoản kết nối thành công");
      return result?.success === true;
    } catch (error) {
      console.error(`Error activating account ID ${id}:`, error);
      return false;
    }
  }

  /**
   * Hủy kích hoạt tài khoản kết nối
   * GET /tai-khoan-ket-noi/huy-duyet/{id}
   */
  async deactivate(id: number): Promise<boolean> {
    try {
      const result = await getData(`tai-khoan-ket-noi/huy-duyet/${id}`);
      apiMessages.success("Hủy kích hoạt tài khoản kết nối thành công");
      return result?.success === true;
    } catch (error) {
      console.error(`Error deactivating account ID ${id}:`, error);
      return false;
    }
  }

  /**
   * Lấy danh sách công trình của doanh nghiệp kèm thông tin kết nối và giấy phép
   * GET /tai-khoan-ket-noi/business-constructions
   */
  async getBusinessConstructions(): Promise<BusinessConstructionDto[]> {
    try {
      const result = await getData("tai-khoan-ket-noi/business-constructions");
      return result || [];
    } catch (error) {
      console.error("Error fetching business constructions:", error);
      return [];
    }
  }

  /**
   * Lấy danh sách công trình theo quyền người dùng (Business hoặc Construction)
   * GET /tai-khoan-ket-noi/client-constructions
   */
  async getClientConstructions(): Promise<BusinessConstructionDto[]> {
    try {
      const result = await getData("tai-khoan-ket-noi/client-constructions");
      return result || [];
    } catch (error) {
      console.error("Error fetching client constructions:", error);
      return [];
    }
  }
}

// Export singleton instance
export const dataTransmissionService = new DataTransmissionService();
export default dataTransmissionService;
