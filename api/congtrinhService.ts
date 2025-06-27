import { getData, saveData, apiMessages } from "./index";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/ApiURL";
import { Alert } from "react-native";

// ======================== TYPES ========================

// DTO cho loại công trình - matching exactly with backend CT_LoaiDto
export interface CT_LoaiDto {
  id?: number;
  idCha?: number;
  tenLoaiCT?: string;
  maLoaiCT?: string;
  chuThich?: string;
  daXoa?: boolean;
}

// DTO cho bộ lọc công trình
export interface CongTrinhFilterDto {
  tenCT?: string;
  idLoaiCT?: number;
  idHuyen?: number;
  idXa?: number;
  idSong?: number;
  idLuuVuc?: number;
  idTieuLuuVuc?: number;
  idTangChuaNuoc?: number;
  nguonNuocKT?: string;
}

// DTO cho vị trí công trình - matching exactly with backend CT_ViTriDto
export interface CT_ViTriDto {
  id?: number;
  idCongTrinh?: number;
  idXa?: string;
  idHuyen?: string;
  tenHuyen?: string;
  tenXa?: string;
}

// DTO cho hạng mục công trình - matching exactly with backend CT_HangMucDto
export interface CT_HangMucDto {
  id?: number;
  idCT?: number;
  idTangChuaNuoc?: number;
  tenHangMuc?: string;
  viTriHangMuc?: string; // Fixed: was vịTriHangMuc
  x?: number;
  y?: number;
  chuThich?: string;
  daXoa?: boolean;
  thongso?: CT_ThongSoDto;
}

// DTO cho thông số công trình - matching exactly with backend CT_ThongSoDto
export interface CT_ThongSoDto {
  id?: number;
  idCT?: number;
  idHangMucCT?: number;
  caoTrinhCong?: string;
  cheDoKT?: string;
  caoTrinhDap?: string;
  cheDoXT?: string;
  nguonNuocXT?: string;
  chieuCaoDap?: number;
  chieuDaiCong?: number;
  chieuDaiDap?: number;
  duongKinhCong?: string;
  chieuRongDap?: number;
  nguongTran?: number;
  chieuSauDoanThuNuocDen?: number;
  chieuSauDoanThuNuocTu?: number;
  congSuatBom?: number;
  congSuatDamBao?: number;
  congSuatLM?: number;
  dienTichLuuVuc?: number;
  dienTichTuoiThietKe?: number;
  dienTichTuoiThucTe?: number;
  dungTichChet?: number;
  dungTichHuuIch?: number;
  dungTichToanBo?: number;
  hBeHut?: number;
  hDatOngLocDen?: number;
  hDatOngLocTu?: number;
  hDoanThuNuocDen?: number;
  hDoanThuNuocTu?: number;
  hDong?: number;
  hgieng?: number;
  hGiengKT?: number;
  hHaLuu?: number;
  hHaThap?: number;
  hlu?: number;
  hmax?: number;
  hmin?: number;
  hThuongLuu?: number;
  hTinh?: number;
  htoiThieu?: number;
  kichThuocCong?: string;
  kqKf?: number;
  luongNuocKT?: number;
  mNC?: number;
  mNDBT?: number;
  mNLKT?: number;
  mNLTK?: number;
  muaTrungBinhNam?: number;
  mucNuocDong?: number;
  mucNuocTinh?: number;
  phuongThucXT?: string;
  qBomLonNhat?: number;
  qBomThietKe?: number;
  qDamBao?: number;
  qKhaiThac?: number;
  qKTCapNuocSinhHoat?: number;
  qKTLonNhat?: number;
  qLonNhatTruocLu?: number;
  qMaxKT?: number;
  qmaxNM?: number;
  qMaxXaThai?: number;
  qThietKe?: number;
  qThucTe?: number;
  qTrungBinhNam?: number;
  qtt?: number;
  qXaThai?: number;
  qXaThaiLonNhat?: number;
  qXaThaiTB?: number;
  qXaTran?: number;
  soLuongMayBom?: number;
  thoiGianBomLonNhat?: string;
  thoiGianBomNhoNhat?: string;
  thoiGianBomTB?: string;
}

// DTO cho lưu lượng theo mục đích - referenced in backend DTOs
export interface LuuLuongTheoMucDichDto {
  id?: number;
  idCT?: number;
  idMucDich?: number;
  mucDich?: string;
  luuLuong?: number;
  donViDo?: string;
  ghiChu?: string;
  daXoa?: boolean;
}

// DTO cho mục đích khai thác - matching exactly with backend MucDichKTDto
export interface MucDichKTDto {
  id?: number;
  mucDich?: string;
  daXoa?: boolean;
  luuLuong?: LuuLuongTheoMucDichDto;
}

// DTO cho công trình - matching exactly with backend CT_ThongTinDto
export interface CT_ThongTinDto {
  id?: number;
  idLoaiCT?: number;
  idSong?: number;
  idLuuVuc?: number;
  idTieuLuuVuc?: number;
  idTangChuaNuoc?: number;
  tenCT?: string;
  maCT?: string;
  viTriCT?: string;
  x?: number;
  y?: number;
  capCT?: string;
  namBatDauVanHanh?: number;
  nguonNuocKT?: string;
  mucDichKT?: string;
  phuongThucKT?: string;
  thoiGianKT?: string;
  thoiGianHNK?: string;
  mucDichHNK?: string;
  mucDichhTD?: string;
  quyMoHNK?: string;
  thoiGianXD?: string;
  soLuongGiengKT?: number;
  soLuongGiengQT?: number;
  soDiemXaThai?: number;
  soLuongGieng?: number;
  khoiLuongCacHangMucTD?: number;
  qKTThietKe?: number;
  qKTThucTe?: number;
  viTriXT?: string;
  chuThich?: string;
  taiKhoan?: string;
  daXoa?: boolean;

  // Related objects
  hangmuc?: CT_HangMucDto[];
  luuluong_theomd?: LuuLuongTheoMucDichDto[];
  thongso?: CT_ThongSoDto;
  vitri?: CT_ViTriDto[];

  // For additional data
  loaiCT?: CT_LoaiDto;
  luuvuc?: any; // LuuVucSongDto
  xa?: any[]; // XaDto[]
  huyen?: any[]; // HuyenDto[]
  giayphep?: any[]; // GP_ThongTinDto[]
  mucdich_kt?: MucDichKTDto[];
  thanhTraKiemTra?: any[]; // ThanhTraKiemTraDto[]
  tongLuuLuong?: number;
  donViTinhLuuLuong?: string;
}

// ======================== CONG TRINH SERVICE ========================
export class CongTrinhService {
  /**
   * Lấy danh sách công trình với bộ lọc
   * GET /cong-trinh/danh-sach
   */
  async getAll(filter?: CongTrinhFilterDto): Promise<CT_ThongTinDto[]> {
    try {
      const result = await getData("cong-trinh/danh-sach", filter);
      Alert.alert("Thông báo", result);
      return result || [];
    } catch (error) {
      console.error("Error fetching constructions:", error);
      return [];
    }
  }

  /**
   * Lấy thông tin chi tiết công trình theo ID
   * GET /cong-trinh/{id}
   */
  async getById(id: number): Promise<CT_ThongTinDto | null> {
    try {
      const result = await getData(`cong-trinh/${id}`);
      return result || null;
    } catch (error) {
      console.error(`Error fetching construction with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Lấy công trình của người dùng đang đăng nhập (role Construction)
   * GET /ct-thong-tin/my-construction
   */
  async getMyConstruction(): Promise<CT_ThongTinDto | null> {
    try {
      const result = await getData("ct-thong-tin/my-construction");
      return result || null;
    } catch (error) {
      console.error("Error fetching my construction:", error);
      return null;
    }
  }

  /**
   * Lưu thông tin công trình (tạo mới hoặc cập nhật)
   * POST /cong-trinh/luu
   */
  async save(
    data: CT_ThongTinDto,
    useTransaction = true
  ): Promise<number | null> {
    try {
      // Pass the useTransaction boolean directly to saveData
      const result = await saveData(
        "cong-trinh/luu",
        data,
        "Lưu thông tin công trình thành công",
        useTransaction
      );
      return result?.id || null;
    } catch (error) {
      console.error("Error saving construction:", error);
      return null;
    }
  }

  /**
   * Xóa công trình
   * GET /cong-trinh/xoa/{id}
   */
  async delete(id: number): Promise<boolean> {
    try {
      const result = await getData(`cong-trinh/xoa/${id}`, null, undefined);
      apiMessages.success("Xóa công trình thành công");
      return result?.message != null;
    } catch (error) {
      console.error(`Error deleting construction with ID ${id}:`, error);
      return false;
    }
  }

  /**
   * Lấy danh sách loại công trình
   * GET /loai-ct/danh-sach
   */
  async getLoaiCongTrinh(): Promise<CT_LoaiDto[]> {
    try {
      const result = await getData("loai-ct/danh-sach");
      return result || [];
    } catch (error) {
      console.error("Error fetching construction types:", error);
      return [];
    }
  }

  /**
   * Lấy thông tin chi tiết loại công trình theo ID
   * GET /loai-ct/{id}
   */
  async getLoaiCongTrinhById(id: number): Promise<CT_LoaiDto | null> {
    try {
      const result = await getData(`loai-ct/${id}`);
      return result || null;
    } catch (error) {
      console.error(`Error fetching construction type with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Lưu thông tin loại công trình (tạo mới hoặc cập nhật)
   * POST /loai-ct/luu
   */
  async saveLoaiCongTrinh(data: CT_LoaiDto): Promise<boolean> {
    try {
      const result = await saveData(
        "loai-ct/luu",
        data,
        "Lưu thông tin loại công trình thành công"
      );
      return result !== null;
    } catch (error) {
      console.error("Error saving construction type:", error);
      return false;
    }
  }

  /**
   * Xóa loại công trình
   * GET /loai-ct/xoa/{id}
   */
  async deleteLoaiCongTrinh(id: number): Promise<boolean> {
    try {
      const result = await getData(`loai-ct/xoa/${id}`);
      apiMessages.success("Xóa loại công trình thành công");
      return result?.message != null;
    } catch (error) {
      console.error(`Error deleting construction type with ID ${id}:`, error);
      return false;
    }
  }

  /**
   * Lấy danh sách hạng mục công trình theo ID công trình
   * GET /hang-muc-ct/cong-trinh/{id}
   */
  async getHangMucByCongTrinh(idCongTrinh: number): Promise<CT_HangMucDto[]> {
    try {
      const result = await getData(`hang-muc-ct/cong-trinh/${idCongTrinh}`);
      return result || [];
    } catch (error) {
      console.error("Error fetching hang muc by cong trinh:", error);
      return [];
    }
  }

  /**
   * Lưu hạng mục công trình (tạo mới hoặc cập nhật)
   * POST /hang-muc-ct/luu
   */
  async saveHangMuc(data: CT_HangMucDto): Promise<boolean> {
    try {
      const result = await saveData(
        "hang-muc-ct/luu",
        data,
        "Hạng mục công trình đã được lưu thành công"
      );
      return result !== null;
    } catch (error) {
      console.error("Error saving hang muc:", error);
      return false;
    }
  }

  /**
   * Xóa hạng mục công trình
   * DELETE /hang-muc-ct/xoa/{id}
   */
  async deleteHangMuc(id: number): Promise<boolean> {
    try {
      const result = await getData(`hang-muc-ct/xoa/${id}`);
      return result !== null;
    } catch (error) {
      console.error("Error deleting hang muc:", error);
      return false;
    }
  }

  /**
   * Lấy thông số công trình theo ID công trình
   * GET /thong-so-ct/cong-trinh/{id}
   */
  async getThongSoByCongTrinh(
    idCongTrinh: number
  ): Promise<CT_ThongSoDto | null> {
    try {
      const result = await getData(`thong-so-ct/cong-trinh/${idCongTrinh}`);
      return result;
    } catch (error) {
      console.error("Error fetching thong so by cong trinh:", error);
      return null;
    }
  }

  /**
   * Lưu thông số công trình (tạo mới hoặc cập nhật)
   * POST /thong-so-ct/luu
   */
  async saveThongSo(data: CT_ThongSoDto): Promise<boolean> {
    try {
      const result = await saveData(
        "thong-so-ct/luu",
        data,
        "Thông số công trình đã được lưu thành công"
      );
      return result !== null;
    } catch (error) {
      console.error("Error saving thong so:", error);
      return false;
    }
  }

  /**
   * Xóa thông số công trình
   * DELETE /thong-so-ct/xoa/{id}
   */
  async deleteThongSo(idCT: number): Promise<boolean> {
    try {
      const result = await getData(`thong-so-ct/xoa/${idCT}`);
      return result !== null;
    } catch (error) {
      console.error("Error deleting thong so:", error);
      return false;
    }
  }

  /**
   * Lấy danh sách vị trí công trình theo ID công trình
   * GET /vi-tri-ct/cong-trinh/{id}
   */
  async getViTriByCongTrinh(idCongTrinh: number): Promise<CT_ViTriDto[]> {
    try {
      const result = await getData(`vi-tri-ct/cong-trinh/${idCongTrinh}`);
      return result || [];
    } catch (error) {
      console.error("Error fetching vi tri by cong trinh:", error);
      return [];
    }
  }

  /**
   * Lưu vị trí công trình (tạo mới hoặc cập nhật)
   * POST /vi-tri-ct/luu
   */
  async saveViTri(data: CT_ViTriDto): Promise<boolean> {
    try {
      const result = await saveData(
        "vi-tri-ct/luu",
        data,
        "Vị trí công trình đã được lưu thành công"
      );
      return result !== null;
    } catch (error) {
      console.error("Error saving vi tri:", error);
      return false;
    }
  }

  /**
   * Xóa vị trí công trình
   * DELETE /vi-tri-ct/xoa/{id}
   */
  async deleteViTri(id: number): Promise<boolean> {
    try {
      const result = await getData(`vi-tri-ct/xoa/${id}`);
      return result !== null;
    } catch (error) {
      console.error("Error deleting vi tri:", error);
      return false;
    }
  }

  /**
   * Lấy danh sách công trình chưa liên kết với tài khoản
   * GET /cong-trinh/unlinked
   */
  async getUnlinkedConstructions(): Promise<CT_ThongTinDto[]> {
    try {
      const result = await getData("cong-trinh/unlinked");
      return result || [];
    } catch (error) {
      console.error("Error fetching unlinked constructions:", error);
      return [];
    }
  }

  /**
   * Liên kết tài khoản người dùng với công trình
   * POST /cong-trinh/set-account/{constructionId}
   * @param constructionId ID của công trình
   * @param accountName Tên tài khoản người dùng
   */
  async setConstructionAccount(
    constructionId: number,
    accountName: string
  ): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("authToken");

      await axios.post(
        `${API_BASE_URL}/cong-trinh/set-account/${constructionId}`,
        { accountName: accountName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      apiMessages.success("Liên kết tài khoản với công trình thành công");
      return true;
    } catch (error) {
      console.error("Error linking account to construction:", error);
      apiMessages.error("Không thể liên kết tài khoản với công trình");
      return false;
    }
  }
}

// Export singleton instance
export const congtrinhService = new CongTrinhService();
export default congtrinhService;
