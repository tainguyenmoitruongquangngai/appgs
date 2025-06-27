# Hướng dẫn Build IPA cho TestFlight

## Yêu cầu trước khi build

### 1. Cài đặt EAS CLI

```bash
npm install -g @expo/eas-cli
```

### 2. Đăng nhập Expo

```bash
eas login
```

### 3. Tạo project trên Expo

```bash
eas init
```

### 4. Cấu hình Apple Developer

#### Bước 4.1: Tài khoản Apple Developer

- Đăng ký tài khoản Apple Developer ($99/năm)
- Truy cập: https://developer.apple.com/account/

#### Bước 4.2: Tạo App ID

1. Vào Apple Developer Console
2. Certificates, Identifiers & Profiles → Identifiers
3. Tạo App ID mới với Bundle ID: `com.gstnmt.qn`

#### Bước 4.3: Tạo Certificates

```bash
eas credentials
```

- Chọn iOS
- Chọn production
- EAS sẽ tự động tạo certificates

## Các bước build

### Bước 1: Kiểm tra cấu hình

```bash
cd d:/Work/QuangNgai/appgs
```

### Bước 2: Build preview (test internal)

```bash
npm run build:ios-preview
```

### Bước 3: Build production (cho TestFlight)

```bash
npm run build:ios
```

### Bước 4: Submit lên App Store Connect

```bash
npm run submit:ios
```

## Cấu hình chi tiết

### app.json đã được cấu hình:

- ✅ Bundle Identifier: `com.gstnmt.qn`
- ✅ App Name: "Hệ thống Quản trị Dữ liệu"
- ✅ Version: 1.0.0
- ✅ Build Number: 1.0.0
- ✅ Permissions (Camera, Photos, Location)

### eas.json đã được tạo với profiles:

- `development`: Cho development build
- `preview`: Cho internal testing
- `production-ios`: Cho production build

## Workflow build

### 1. Build Preview (Internal Testing)

```bash
eas build --platform ios --profile preview
```

- Tạo file IPA cho internal distribution
- Có thể test ngay không cần App Store
- Install qua link hoặc TestFlight internal

### 2. Build Production (TestFlight)

```bash
eas build --platform ios --profile production-ios
```

- Tạo file IPA cho App Store
- Cần submit lên App Store Connect
- Phân phối qua TestFlight

### 3. Submit to App Store Connect

```bash
eas submit --platform ios
```

- Tự động upload IPA lên App Store Connect
- Cần Apple ID và App-specific password

## Lưu ý quan trọng

### 1. Apple Developer Account

- Cần tài khoản Apple Developer ($99/năm)
- Phải verify identity

### 2. Bundle Identifier

- Phải unique trên App Store
- Hiện tại: `com.gstnmt.qn`
- Có thể đổi nếu bị trùng

### 3. Certificates & Provisioning

- EAS tự động quản lý
- Có thể manual nếu cần

### 4. App Store Connect

- Cần tạo app trên App Store Connect
- Bundle ID phải match với project

## Troubleshooting

### Lỗi thường gặp:

#### 1. Bundle ID đã tồn tại

```bash
# Đổi bundle ID trong app.json và eas.json
"bundleIdentifier": "com.gstnmt.qn.v2"
```

#### 2. Certificates lỗi

```bash
eas credentials --clear-cache
eas credentials
```

#### 3. Build fail

```bash
eas build --platform ios --profile production-ios --clear-cache
```

#### 4. Submit fail

- Kiểm tra Apple ID credentials
- Tạo App-specific password

## Kiểm tra build

### 1. Kiểm tra build status

```bash
eas build:list
```

### 2. Download IPA

- Vào Expo dashboard
- Download file .ipa
- Test trên device qua Xcode/TestFlight

### 3. TestFlight

- Upload thành công → App Store Connect
- Add testers
- Release for testing

## Next Steps sau khi build

1. **Kiểm tra build**: Download và test IPA
2. **App Store Connect**: Tạo app metadata
3. **TestFlight**: Setup testing groups
4. **Screenshots**: Chuẩn bị screenshots cho App Store
5. **Review**: Submit for App Store review

## Commands tổng hợp

```bash
# Setup
npm install -g @expo/eas-cli
eas login
eas init

# Build
npm run build:ios-preview    # Internal testing
npm run build:ios           # Production
npm run submit:ios          # Submit to App Store

# Debug
eas build:list              # Check build status
eas credentials             # Manage certificates
```

---

**Lưu ý**: Quá trình build có thể mất 10-20 phút. Hãy kiên nhẫn và kiểm tra logs nếu có lỗi.
