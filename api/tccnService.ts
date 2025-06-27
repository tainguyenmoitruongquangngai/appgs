import { getData, saveData } from './index'

// DTO cho tổ chức cá nhân - matching exactly with backend ToChuc_CaNhanDto
export interface ToChuc_CaNhanDto {
  id?: number
  tenTCCN?: string
  diaChi?: string
  maSoThue?: string
  sdt?: string // Fixed: was sDT to match backend
  fax?: string
  email?: string
  giamDoc?: string
  nguoiDuocUyQuyen?: string
  nguoiDaiDienPhapLuat?: string
  taiKhoan?: string
  daXoa?: boolean
}

class TCCNService {
  /**
   * Lấy danh sách tổ chức cá nhân
   * GET /to-chuc-ca-nhan/danh-sach
   */
  async getAll(useGlobalLoading = true): Promise<ToChuc_CaNhanDto[]> {
    try {
      const result = await getData('to-chuc-ca-nhan/danh-sach', null, undefined, useGlobalLoading)
      return result || []
    } catch (error) {
      console.error('Error fetching ToChucCaNhan list:', error)
      return []
    }
  }

  /**
   * Lấy thông tin tổ chức cá nhân theo ID
   * GET /to-chuc-ca-nhan/{Id}
   */
  async getById(id: number, useGlobalLoading = true): Promise<ToChuc_CaNhanDto | null> {
    if (!id) return null

    try {
      const result = await getData(`to-chuc-ca-nhan/${id}`, null, undefined, useGlobalLoading)
      return result
    } catch (error) {
      console.error(`Error fetching ToChucCaNhan with id ${id}:`, error)
      return null
    }
  }

  /**
   * Lưu thông tin tổ chức cá nhân (tạo mới hoặc cập nhật)
   * POST /to-chuc-ca-nhan/luu
   */
  async save(data: Partial<ToChuc_CaNhanDto>, useGlobalLoading = true): Promise<boolean> {
    try {
      const result = await saveData('to-chuc-ca-nhan/luu', data, undefined, useGlobalLoading)
      return !!result && !result.error
    } catch (error) {
      console.error('Error saving ToChucCaNhan:', error)
      return false
    }
  }

  /**
   * Xóa tổ chức cá nhân theo ID
   * GET /to-chuc-ca-nhan/xoa/{Id}
   */
  async delete(id: number, useGlobalLoading = true): Promise<boolean> {
    try {
      const result = await getData(`to-chuc-ca-nhan/xoa/${id}`, null, undefined, useGlobalLoading)
      return !!result && !result.error
    } catch (error) {
      console.error(`Error deleting ToChucCaNhan with id ${id}:`, error)
      return false
    }
  }

  /**
   * Lấy danh sách tổ chức cá nhân chưa liên kết với tài khoản
   * GET /to-chuc-ca-nhan/unlinked
   */
  async getUnlinkedBusinesses(useGlobalLoading = true): Promise<ToChuc_CaNhanDto[]> {
    try {
      const result = await getData('to-chuc-ca-nhan/unlinked', null, undefined, useGlobalLoading)
      return result || []
    } catch (error) {
      console.error('Error fetching unlinked ToChucCaNhan:', error)
      return []
    }
  }
}

export const tccnService = new TCCNService()
