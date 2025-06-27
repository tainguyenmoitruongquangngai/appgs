import { getData } from './index'

// DTO cho dữ liệu giám sát - matching exactly with backend GS_SoLieuDto
export interface GS_SoLieuDto {
  id?: number
  tenCT?: string
  maCT?: string
  loaiCT?: any // CT_LoaiDto
  x?: number
  y?: number
  MUATHUONGLUU?: number
  qXaMaxTT?: number
  dungTichTT?: number
  hHaLuuTT?: number
  hThuongLuuTT?: number
  qMinTT?: number
  qMaxTT?: number
  qXaTranTT?: number
  DCTTTT?: number
  qKhaiThac?: number

  nhietDo?: number
  PH?: number
  BOD?: number
  COD?: number
  DO?: number
  TSS?: number
  NH4?: number
  GIENGKHOAN?: number
  GIENGQUANTRAC?: number
  NUOCTHAI?: number
  thoiGian?: Date
  matKetNoi?: number
  loi?: number

  thongso?: any // CT_ThongSoDto
}

// DTO cho dữ liệu giám sát chi tiết theo thời gian - matching exactly with backend StoragePreDataDto
export interface StoragePreDataDto {
  id?: number
  constructionCode?: string
  stationCode?: string
  parameterName?: string
  value?: number
  unit?: string
  time?: Date
  deviceStatus?: number
  status?: boolean
  data?: { [key: string]: number }
}

// ======================== GIAM SAT SERVICE ========================
export class GiamSatService {
  /**
   * Lấy danh sách dữ liệu giám sát
   * GET /GiamSatSoLieu/danhsach
   */
  async getMonitoringData(filter?: { MaCT?: string; tenct?: string; loai_ct?: number }): Promise<GS_SoLieuDto[]> {
    try {
      const result = await getData('GiamSatSoLieu/danhsach', filter)
      console.log('🔍 GiamSatSoLieu/danhsach được gọi với filter:', filter)
      console.trace('🔍 Call Stack:') // Hiển thị stack trace đầy đủ

      return result || []
    } catch (error) {
      console.error('Error fetching monitoring data:', error)
      return []
    }
  }

  /**
   * Lấy dữ liệu giám sát chi tiết theo thời gian
   * GET /GiamSatSoLieu/thong-tin
   */
  async getMonitoringDetails(
    constructionCode?: string,
    startDate?: Date | string,
    endDate?: Date | string
  ): Promise<StoragePreDataDto[]> {
    try {
      // Xử lý chuỗi hoặc đối tượng Date
      const startDateStr = startDate instanceof Date ? startDate.toISOString() : startDate
      const endDateStr = endDate instanceof Date ? endDate.toISOString() : endDate

      const params = {
        ConstructionCode: constructionCode,
        StartDate: startDateStr,
        EndDate: endDateStr
      }

      const result = await getData('GiamSatSoLieu/thong-tin', params)
      return result || []
    } catch (error) {
      console.error('Error fetching monitoring details:', error)
      return []
    }
  }

  /**
   * Lấy dữ liệu giám sát theo khoảng thời gian (phiên bản đơn giản)
   * GET /GiamSatSoLieu/thong-tin
   */
  async getMonitoringDataByTimeRange(
    constructionCode: string,
    startDate: Date | string,
    endDate: Date | string
  ): Promise<StoragePreDataDto[]> {
    return this.getMonitoringDetails(constructionCode, startDate, endDate)
  }

  /**
   * Tương thích ngược với congtrinhService - Lấy danh sách dữ liệu giám sát
   * GET /GiamSatSoLieu/danhsach
   * @deprecated Sử dụng getMonitoringData thay thế
   */
  async getGiamSatSoLieu(filter?: { MaCT?: string; tenct?: string; loai_ct?: number }): Promise<GS_SoLieuDto[]> {
    return this.getMonitoringData(filter)
  }

  /**
   * Tương thích ngược với congtrinhService - Lấy dữ liệu giám sát theo thời gian
   * GET /GiamSatSoLieu/thong-tin
   * @deprecated Sử dụng getMonitoringDetails thay thế
   */
  async getGiamSatThongTin(
    constructionCode?: string,
    startDate?: string,
    endDate?: string
  ): Promise<StoragePreDataDto[]> {
    return this.getMonitoringDetails(constructionCode, startDate, endDate)
  }

  /**
   * Tương thích ngược với congtrinhService - Lấy dữ liệu giám sát theo thời gian (phiên bản đơn giản)
   * GET /GiamSatSoLieu/thong-tin
   * @deprecated Sử dụng getMonitoringDataByTimeRange thay thế
   */
  async getGiamSatData(constructionCode: string, startDate: string, endDate: string): Promise<StoragePreDataDto[]> {
    return this.getMonitoringDetails(constructionCode, startDate, endDate)
  }
}

// Export singleton instance
export const giamSatService = new GiamSatService()
export default giamSatService
