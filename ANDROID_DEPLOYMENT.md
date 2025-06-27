# 🚀 Hướng dẫn Upload .aab lên Google Play Console

## 📱 **File .aab đã sẵn sàng**

- **Download**: https://expo.dev/artifacts/eas/qVvHdWpVFKiuLEuUETZDjY.aab
- **Build ID**: c9d40ebb-4c16-4d57-b52e-7df67468be58
- **Package**: com.gstnmt.qn
- **Version**: 1.0.0

## 🎯 **Cách upload lên Google Play Store:**

### Bước 1: Tạo Google Play Console Account

1. Truy cập: https://play.google.com/console/
2. Trả phí $25 (một lần duy nhất)
3. Đăng ký developer account

### Bước 2: Tạo App mới

1. Tạo app mới trong Google Play Console
2. Điền thông tin app:
   - **App name**: "Hệ thống Quản trị Dữ liệu"
   - **Package name**: com.gstnmt.qn
   - **Category**: Business/Productivity

### Bước 3: Upload .aab file

1. Vào **Release** → **Production**
2. Click **Create new release**
3. Upload file .aab đã download
4. Điền **Release notes**
5. **Save** và **Review release**

### Bước 4: Hoàn thiện Store Listing

- **Screenshots**: Cần 2-8 screenshots
- **Description**: Mô tả app
- **Privacy Policy**: Link chính sách bảo mật
- **Content rating**: Đánh giá độ tuổi

### Bước 5: Submit for Review

- **Internal testing** → **Production**
- Google review: 1-3 ngày
- App sẽ xuất hiện trên Play Store

## 🔧 **Option 2: Test trước khi upload**

### Chuyển .aab thành .apk để test:

```bash
# Download bundletool
curl -L -o bundletool.jar https://github.com/google/bundletool/releases/latest/download/bundletool-all-1.17.2.jar

# Tạo .apks từ .aab
java -jar bundletool.jar build-apks --bundle=app.aab --output=app.apks

# Cài .apks lên device
java -jar bundletool.jar install-apks --apks=app.apks
```

## 📋 **Checklist trước khi upload:**

- ✅ Download file .aab
- ✅ Test app trên device thật
- ✅ Chuẩn bị screenshots (2-8 ảnh)
- ✅ Viết description
- ✅ Tạo privacy policy
- ✅ Google Play Console account ($25)

## 🎊 **Kết quả mong đợi:**

1. **Upload thành công** → App xuất hiện trong console
2. **Internal testing** → Test với team
3. **Production release** → App live trên Play Store
4. **Users download** → Người dùng có thể tải app

---

## 🚀 **Quick Actions:**

```bash
# Download .aab file
curl -L -o gstnmt-qn.aab https://expo.dev/artifacts/eas/qVvHdWpVFKiuLEuUETZDjY.aab

# Check file info
file gstnmt-qn.aab
```

**🎯 File .aab sẵn sàng upload lên Google Play Store!**
