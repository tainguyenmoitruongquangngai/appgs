import { PageResponse } from './authService'
import { getData, saveData, apiMessages } from './index'

// ======================== TYPES ========================

// Bộ lọc giấy phép - đồng bộ với GPFilterFormDto trong backend
export interface GPFilterFormDto {
  // Các thông tin tìm kiếm giấy phép
  id?: number
  soGP?: string
  cong_trinh?: string // Tên công trình
  coquan_cp?: string // Cơ quan cấp phép
  loaihinh_cp?: number // Loại hình cấp phép (idLoaiGP)
  hieuluc_gp?: string // Hiệu lực giấy phép: "con-hieu-luc", "sap-het-hieu-luc", "het-hieu-luc", "da-bi-thu-hoi"

  // Thông tin công trình
  loai_ct?: number // ID loại công trình
  tang_chuanuoc?: number // Tầng chứa nước

  // Thông tin địa lý
  huyen?: number
  xa?: number
  tieuvung_qh?: number

  // Các thông tin khác
  tochuc_canhan?: number // ID tổ chức/cá nhân
  tu_nam?: number // Năm bắt đầu
  den_nam?: number // Năm kết thúc

  // Thông tin phân trang
  pageNumber?: number // Số trang, mặc định là 1
  pageSize?: number // Số bản ghi mỗi trang, mặc định là 10

  // Các trường bổ sung cho frontend
  page?: string // Trang hiện tại (nếu có)
  type?: string // Loại trang (nếu có)

  // Các trường bổ sung cho frontend
  tenCT?: string // Tên công trình - dùng trong frontend
  tenTCCN?: string
  tenCQCP?: string
  idTCCN?: number
  idCoQuanCP?: number
  idCT?: number
  tuNgayKy?: string | null
  denNgayKy?: string | null
  tuNgayHHL?: string | null
  denNgayHHL?: string | null
  idLoaiGP?: number
  status?: number // Status cho frontend - 1: con-hieu-luc, 2: sap-het-hieu-luc, 3: het-hieu-luc
  idHuyen?: number
}

// Thống kê giấy phép theo tình trạng
export interface LicenseStatisticsDto {
  totalLicenses: number
  validLicenses: number
  expiredLicenses: number
  expiringLicenses: number
  revokedLicenses: number
  pendingLicenses: number
}

// Thống kê giấy phép theo cơ quan cấp phép
export interface CountFolowLicensingAuthoritiesDto {
  quocHoi: number
  thuTuong: number
  bonNNPTNT: number
  bnmt: number
  ubndTinh: number
  btnmt: number
  soTNMT: number
}

// Thống kê giấy phép theo loại công trình
export interface CountFolowConstructionTypesDto {
  ktsd_nm?: CountFolowConsTypesData // Khai thác sử dụng nước mặt
  ktsd_ndd?: CountFolowConsTypesData // Khai thác sử dụng nước dưới đất
  thamdo_ndd?: CountFolowConsTypesData // Thăm dò nước dưới đất
  hnk_ndd?: CountFolowConsTypesData // Hành nghề khoan nước dưới đất
  xathai?: CountFolowConsTypesData // Xả thải
}

// Chi tiết thống kê theo từng loại
export interface CountFolowConsTypesData {
  total: number // Tổng số giấy phép
  con_hieuluc: number // Số giấy phép còn hiệu lực
  bo_cap: number // Số giấy phép do bộ cấp
  tinh_cap: number // Số giấy phép do tỉnh cấp
}

// DTO cho giấy phép
export interface GP_ThongTinDto {
  id?: number
  idCon?: number | null
  idLoaiGP?: number | null
  idTCCN?: number | null
  idCT?: number | null
  tenGP?: string | null
  soGP?: string | null
  ngayKy?: string | null // ISO string
  ngayCoHieuLuc?: string | null // ISO string
  ngayHetHieuLuc?: string | null // ISO string
  thoiHan?: string | null
  coQuanCapPhep?: string | null
  fileGiayPhep?: string | null
  fileGiayToLienQuan?: string | null
  fileDonXinCP?: string | null

  // Các quan hệ/phức hợp
  congtrinh?: any | null // ConstructionState | null
  tochuc_canhan?: any | null // BusinessState | null
  tiencq?: any[] | null // LicenseFeeState[] | null
  thanhTraKiemTra?: any | null // thanhtra_kiemtra: any | null

  // Các trường trạng thái, backend
  daBiThuHoi?: boolean | null
  daXoa?: boolean | null
  trangThaiCapPhep?: boolean | null
  hieuluc_gp?: string | null // "con-hieu-luc", "sap-het-hieu-luc", "het-hieu-luc", "da-bi-thu-hoi"

  // Các quan hệ/phức hợp mở rộng
  giayphep_cu?: GP_ThongTinDto | null
  loaiGP?: any // GP_LoaiDto | null
  tangchuanuoc?: any // TangChuaNuocDto | null
  gp_tcq?: any[] | null // GP_TCQDto[] | null
  lichSuCapPhep?: GP_ThongTinDto[] | null
  giayPhepCuaToChuc?: GP_ThongTinDto[] | null
}

// DTO cho loại giấy phép - matching exactly with backend GP_LoaiDto
export interface GP_LoaiDto {
  id?: number
  tenLoaiGP?: string
  maLoaiGP?: string
  ghiChu?: string
  daXoa?: boolean
}

// ======================== GIAY PHEP SERVICE ========================
export class GiayPhepService {
  /**
   * Lấy danh sách giấy phép với bộ lọc
   * GET /giay-phep/danh-sach
   */
  async getAll(filter?: GPFilterFormDto): Promise<PageResponse<GP_ThongTinDto>> {
    try {
      // Convert frontend model to backend model - direct mapping with backend's GPFilterFormDto
      const backendFilter = filter
        ? {
            // Thông tin tìm kiếm cơ bản
            so_gp: filter.soGP,
            cong_trinh: filter.tenCT || filter.cong_trinh,
            loaihinh_cp: filter.idLoaiGP || filter.loaihinh_cp,
            tochuc_canhan: filter.idTCCN || filter.tochuc_canhan,
            coquan_cp: filter.tenCQCP || filter.coquan_cp,

            // Khoảng thời gian
            tu_nam: filter.tu_nam || (filter.tuNgayKy ? new Date(filter.tuNgayKy).getFullYear() : undefined),
            den_nam: filter.den_nam || (filter.denNgayKy ? new Date(filter.denNgayKy).getFullYear() : undefined),

            // Thông tin địa lý và phân loại
            huyen: filter.idHuyen || filter.huyen,
            xa: filter.xa,
            loai_ct: filter.loai_ct,
            tang_chuanuoc: filter.tang_chuanuoc,
            tieuvung_qh: filter.tieuvung_qh,

            // Hiệu lực giấy phép
            hieuluc_gp:
              filter.hieuluc_gp ||
              (filter.status === 1
                ? 'con-hieu-luc'
                : filter.status === 2
                ? 'sap-het-hieu-luc'
                : filter.status === 3
                ? 'het-hieu-luc'
                : undefined),

            // Phân trang
            pageNumber: filter.pageNumber || 1,
            pageSize: filter.pageSize || 10
          }
        : {}

      // Use GET request with correct parameter names
      const result = await getData('giay-phep/danh-sach', backendFilter)
      return result || { items: [], totalItems: 0, pageNumber: 1, pageSize: 10 }
    } catch (error) {
      console.error('Error fetching permits:', error)
      return { items: [], totalItems: 0, pageNumber: 1, pageSize: 10 }
    }
  }

  /**
   * Lấy thông tin chi tiết giấy phép theo ID
   * GET /giay-phep/{id}
   */
  async getById(id: number): Promise<GP_ThongTinDto | null> {
    try {
      const result = await getData(`giay-phep/${id}`)
      return result || null
    } catch (error) {
      console.error(`Error fetching permit with ID ${id}:`, error)
      return null
    }
  }

  /**
   * Lưu thông tin giấy phép (tạo mới hoặc cập nhật)
   * POST /giay-phep/luu
   */
  async save(data: GP_ThongTinDto): Promise<boolean> {
    try {
      const result = await saveData('giay-phep/luu', data, 'Lưu thông tin giấy phép thành công')
      return result !== null
    } catch (error) {
      console.error('Error saving permit:', error)
      return false
    }
  }

  /**
   * Xóa giấy phép
   * GET /giay-phep/xoa/{id}
   */
  async delete(id: number): Promise<boolean> {
    try {
      const result = await getData(`giay-phep/xoa/${id}`)
      apiMessages.success('Xóa giấy phép thành công')
      return result === true
    } catch (error) {
      console.error(`Error deleting permit with ID ${id}:`, error)
      return false
    }
  }

  /**
   * Phê duyệt giấy phép
   * GET /giay-phep/phe-duyet/{id}
   */
  async approve(id: number): Promise<boolean> {
    try {
      const result = await getData(`giay-phep/duyet/${id}`)
      apiMessages.success('Phê duyệt giấy phép thành công')
      return result === true
    } catch (error) {
      console.error(`Error approving permit with ID ${id}:`, error)
      return false
    }
  }

  /**
   * Hủy phê duyệt giấy phép
   * GET /giay-phep/huy-phe-duyet/{id}
   */
  async cancelApprove(id: number): Promise<boolean> {
    try {
      const result = await getData(`giay-phep/huy-duyet/${id}`)
      apiMessages.success('Hủy phê duyệt giấy phép thành công')
      return result === true
    } catch (error) {
      console.error(`Error cancelling approval for permit with ID ${id}:`, error)
      return false
    }
  }

  /**
   * Lấy thống kê giấy phép theo cơ quan cấp phép
   * GET /giay-phep/thong-ke-co-quan-cp
   */
  async getStatsByAuthorities(): Promise<CountFolowLicensingAuthoritiesDto | null> {
    try {
      const result = await getData('giay-phep/thong-ke-co-quan-cp')
      return result || null
    } catch (error) {
      console.error('Error fetching stats by authorities:', error)
      return null
    }
  }

  /**
   * Lấy thống kê giấy phép theo loại công trình
   * GET /giay-phep/thong-ke-loai-ct
   */
  async getStatsByConstructionTypes(): Promise<CountFolowConstructionTypesDto | null> {
    try {
      const result = await getData('giay-phep/thong-ke-loai-ct')
      return result || null
    } catch (error) {
      console.error('Error fetching stats by construction types:', error)
      return null
    }
  }

  /**
   * Đếm số lượng giấy phép theo hiệu lực
   * GET /giay-phep/dem-theo-hieu-luc
   */
  async countLicenseFollowExpire(filter?: GPFilterFormDto): Promise<LicenseStatisticsDto> {
    try {
      const result = await getData('giay-phep/dem-theo-hieu-luc', filter)
      return (
        result || {
          totalLicenses: 0,
          validLicenses: 0,
          expiringLicenses: 0,
          expiredLicenses: 0,
          revokedLicenses: 0,
          pendingLicenses: 0
        }
      )
    } catch (error) {
      console.error('Error fetching license count by status:', error)
      return {
        totalLicenses: 0,
        validLicenses: 0,
        expiringLicenses: 0,
        expiredLicenses: 0,
        revokedLicenses: 0,
        pendingLicenses: 0
      }
    }
  }

  /**
   * Lấy danh sách loại giấy phép
   * GET /gp-loai
   */
  async getLoaiGiayPhep(): Promise<any[]> {
    try {
      const result = await getData('gp-loai')
      return result || []
    } catch (error) {
      console.error('Error fetching permit types:', error)
      return []
    }
  }
}

// Export singleton instance
export const giayphepService = new GiayPhepService()
export default giayphepService
