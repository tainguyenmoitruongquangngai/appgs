// Core API functions
export {
  getData,
  saveData,
  updateData,
  deleteData,
  uploadFile,
  apiMessages,
  injectLoading,
  injectNotification,
  requestData,
} from "./base";

// Auth Service
export {
  authService,
  type UserDto,
  type LoginDto,
  type RegisterDto,
  type RoleDto,
  type AssignRoleDto,
  type PasswordChangeDto,
  type PasswordChangeResult,
  type PageResponse,
  type PermissionDto,
  type DashboardDto,
  type FunctionDto,
} from "./authService";

// Services
export {
  congtrinhService,
  type CT_ThongTinDto,
  type CT_LoaiDto,
  type CT_ViTriDto,
  type CT_HangMucDto,
  type CT_ThongSoDto,
  type MucDichKTDto,
  type LuuLuongTheoMucDichDto,
  type CongTrinhFilterDto,
} from "./congtrinhService";
export {
  giayphepService,
  type GP_ThongTinDto,
  type GP_LoaiDto,
  type GPFilterFormDto,
  type LicenseStatisticsDto,
} from "./giayphepService";
export {
  giamSatService,
  type GS_SoLieuDto,
  type StoragePreDataDto,
} from "./giamSatService";
export { tccnService, type ToChuc_CaNhanDto } from "./tccnService";
export {
  dataTransmissionService,
  type DataTransmissionAccountsDto,
  type DataConstructionForTransmissionAccountsDto,
  type BusinessConstructionDto,
} from "./dataTransmissionService";

// Cache service
export {
  masterDataCache,
  getCachedData,
  preloadMasterData,
  invalidateCache,
} from "./cacheService";
