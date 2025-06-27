# 🚀 BUILD iOS TESTFLIGHT - COMPLETE SETUP

## ✅ Đã hoàn thành setup

### 1. **EAS CLI đã cài đặt**

- Version: eas-cli/16.13.1
- Sẵn sàng để build

### 2. **Cấu hình project đã sẵn sàng**

- ✅ `app.json`: Bundle ID `com.gstnmt.qn`, permissions
- ✅ `eas.json`: Build profiles (preview, production)
- ✅ `package.json`: Build scripts
- ✅ Scripts: `build-ios.ps1`, `build-ios.sh`

## 🎯 NEXT STEPS - Các bước tiếp theo

### Bước 1: Đăng nhập Expo

```bash
eas login
```

### Bước 2: Khởi tạo project

```bash
eas init
```

### Bước 3: Build preview (test internal)

```bash
npm run build:ios-preview
```

hoặc

```bash
eas build --platform ios --profile preview
```

### Bước 4: Build production (TestFlight)

```bash
npm run build:ios
```

hoặc

```bash
eas build --platform ios --profile production-ios
```

### Bước 5: Submit lên App Store Connect

```bash
npm run submit:ios
```

hoặc

```bash
eas submit --platform ios
```

## ⚠️ YÊU CẦU

### 1. Apple Developer Account

- Cần tài khoản Apple Developer ($99/năm)
- Đăng ký tại: https://developer.apple.com/account/

### 2. App Store Connect

- Tạo app mới với Bundle ID: `com.gstnmt.qn`
- Nếu Bundle ID bị trùng, đổi trong `app.json`

### 3. Certificates & Provisioning

- EAS sẽ tự động tạo và quản lý
- Có thể manual config nếu cần

## 🔧 TROUBLESHOOTING

### Bundle ID đã tồn tại

```json
// Trong app.json, đổi:
"bundleIdentifier": "com.gstnmt.qn.v2"
```

### Clear cache nếu build lỗi

```bash
eas build --platform ios --profile production-ios --clear-cache
```

### Manage credentials

```bash
eas credentials
```

## 📱 FILE OUTPUT

Sau khi build thành công:

- **Preview build**: File `.ipa` để test internal
- **Production build**: File `.ipa` để submit lên App Store Connect

## 🎊 KẾT QUẢ MONG ĐỢI

1. **Build thành công** → Download file `.ipa`
2. **Submit thành công** → App xuất hiện trong App Store Connect
3. **TestFlight** → Add testers và distribute
4. **App Store** → Submit for review

---

## 🚀 QUICK START

```bash
# 1. Login
eas login

# 2. Init project
eas init

# 3. Build for TestFlight
npm run build:ios

# 4. Submit to App Store
npm run submit:ios
```

**Thời gian build**: 10-20 phút
**Cần internet**: Có, build trên cloud

---

✅ **Setup hoàn tất! Sẵn sàng build iOS app lên TestFlight!**
