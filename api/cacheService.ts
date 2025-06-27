import { getData } from './index'

interface CacheItem {
  data: any
  timestamp: number
}

// Thời gian hết hạn cache (24h)
const CACHE_EXPIRY = 24 * 60 * 60 * 1000

// Định nghĩa kiểu cache key để có type checking
export type CacheKey =
  | 'hanh-chinh/xa/danh-sach'
  | 'hanh-chinh/huyen/danh-sach'
  | 'LuuVucSong/danh-sach'
  | 'loai-ct/danh-sach'
  | 'TangChuaNuoc/danh-sach'
  | 'Song/danh-sach'
  | 'TieuLuuVuc/danh-sach'
  | 'loai-gp/danh-sach'
  | string

// Cache trong memory
const memoryCache: Record<string, CacheItem> = {}

/**
 * Lấy dữ liệu từ cache hoặc API nếu cache chưa có hoặc đã hết hạn
 * @param key Cache key (endpoint)
 * @param params Params query (nếu có)
 * @param forceRefresh Bắt buộc lấy mới từ API
 */
export async function getCachedData<T>(key: CacheKey, params?: any, forceRefresh = false): Promise<T> {
  // Tạo cache key duy nhất kết hợp với params
  const cacheKey = params ? `${key}:${JSON.stringify(params)}` : key

  // Kiểm tra cache hiện tại
  const cachedItem = memoryCache[cacheKey]
  const now = Date.now()

  // Sử dụng cache nếu có và chưa hết hạn
  if (cachedItem && now - cachedItem.timestamp < CACHE_EXPIRY && !forceRefresh) {
    return cachedItem.data as T
  }

  // Gọi API để lấy dữ liệu mới

  const result = await getData(key, params, undefined, false) // không hiển thị loading global

  // Lưu vào cache và localStorage
  if (result) {
    return updateCachedData(cacheKey, result) as T
  }

  return result as T
}

/**
 * Xóa một cache cụ thể
 */
export function invalidateCache(key: CacheKey, params?: any): void {
  const cacheKey = params ? `${key}:${JSON.stringify(params)}` : key
  delete memoryCache[cacheKey]
}

/**
 * Xóa toàn bộ cache
 */
export function clearAllCache(): void {
  Object.keys(memoryCache).forEach(key => {
    delete memoryCache[key]
  })
}

/**
 * Pre-load tất cả danh mục cần thiết khi khởi động ứng dụng
 */
export async function preloadMasterData(): Promise<void> {
  try {
    // Danh sách các endpoint cần preload
    const preloadEndpoints: CacheKey[] = [
      'hanh-chinh/xa/danh-sach',
      'hanh-chinh/huyen/danh-sach',
      'LuuVucSong/danh-sach',
      'loai-ct/danh-sach',
      'TangChuaNuoc/danh-sach',
      'Song/danh-sach',
      'loai-gp/danh-sach'
    ]

    // Tải song song tất cả endpoint
    await Promise.all(preloadEndpoints.map(endpoint => getCachedData(endpoint)))
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu danh mục:', error)
  }
}

// Lưu cache vào localStorage
function saveToLocalStorage() {
  try {
    localStorage.setItem('api_cache', JSON.stringify(memoryCache))
  } catch (err) {
    console.warn('Không thể lưu cache vào localStorage:', err)
  }
}

// Load cache từ localStorage
function loadFromLocalStorage() {
  try {
    const cache = localStorage.getItem('api_cache')
    if (cache) {
      const parsedCache = JSON.parse(cache)
      // Chỉ lấy những cache chưa hết hạn
      const now = Date.now()
      Object.keys(parsedCache).forEach(key => {
        if (now - parsedCache[key].timestamp < CACHE_EXPIRY) {
          memoryCache[key] = parsedCache[key]
        }
      })
    }
  } catch (err) {
    console.warn('Lỗi khi đọc cache từ localStorage:', err)
  }
}

// Khởi tạo cache từ localStorage khi import module
loadFromLocalStorage()

// Cập nhật localStorage khi cache thay đổi
function updateCachedData(key: string, data: any) {
  const now = Date.now()
  memoryCache[key] = {
    data,
    timestamp: now
  }
  saveToLocalStorage()
  return data
}

// Các hàm tiện ích cho từng loại dữ liệu
export const masterDataCache = {
  async getDanhSachHuyen() {
    return await getCachedData('hanh-chinh/huyen/danh-sach')
  },

  async getDanhSachXa(huyenId?: number) {
    return await getCachedData('hanh-chinh/xa/danh-sach', huyenId ? { huyenId } : undefined)
  },

  async getLuuVucSong() {
    return await getCachedData('LuuVucSong/danh-sach')
  },

  async getLoaiCongTrinh() {
    return await getCachedData('loai-ct/danh-sach')
  },

  async getTangChuaNuoc() {
    return await getCachedData('TangChuaNuoc/danh-sach')
  },

  async getSong() {
    return await getCachedData('Song/danh-sach')
  },

  async getLoaiGP() {
    return await getCachedData('loai-gp/danh-sach')
  }
}
