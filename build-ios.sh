#!/bin/bash

# Build iOS Script for TestFlight
# Hướng dẫn build app React Native lên TestFlight

echo "🚀 Build iOS App for TestFlight"
echo "================================"

# Kiểm tra EAS CLI
echo "📋 Checking EAS CLI..."
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI không được cài đặt. Đang cài đặt..."
    npm install -g eas-cli
else
    echo "✅ EAS CLI đã được cài đặt: $(eas --version)"
fi

echo ""
echo "📝 Các bước tiếp theo:"
echo "1. Đăng nhập Expo: eas login"
echo "2. Khởi tạo project: eas init"
echo "3. Build preview: npm run build:ios-preview"
echo "4. Build production: npm run build:ios"
echo "5. Submit to App Store: npm run submit:ios"

echo ""
echo "🔧 Cấu hình đã sẵn sàng:"
echo "- ✅ app.json: Bundle ID, permissions"
echo "- ✅ eas.json: Build profiles"
echo "- ✅ package.json: Build scripts"

echo ""
echo "⚠️  Yêu cầu:"
echo "- Apple Developer Account ($99/năm)"
echo "- App Store Connect access"
echo "- Unique Bundle Identifier: com.gstnmt.qn"

echo ""
echo "🎯 Lệnh build nhanh:"
echo "npm run build:ios-preview  # Internal testing"
echo "npm run build:ios          # Production/TestFlight"
