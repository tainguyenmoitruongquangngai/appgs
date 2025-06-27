# Build iOS Script for TestFlight (PowerShell)

Write-Host "Build iOS App for TestFlight" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# Kiểm tra EAS CLI
Write-Host "Checking EAS CLI..." -ForegroundColor Yellow
try {
    $easVersion = eas --version
    Write-Host "EAS CLI đã được cài đặt: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "EAS CLI không được cài đặt. Đang cài đặt..." -ForegroundColor Red
    npm install -g eas-cli
}

Write-Host ""
Write-Host "Các bước tiếp theo:" -ForegroundColor Cyan
Write-Host "1. Đăng nhập Expo: eas login" -ForegroundColor White
Write-Host "2. Khởi tạo project: eas init" -ForegroundColor White
Write-Host "3. Build preview: npm run build:ios-preview" -ForegroundColor White
Write-Host "4. Build production: npm run build:ios" -ForegroundColor White
Write-Host "5. Submit to App Store: npm run submit:ios" -ForegroundColor White

Write-Host ""
Write-Host "Cấu hình đã sẵn sàng:" -ForegroundColor Cyan
Write-Host "- app.json: Bundle ID, permissions" -ForegroundColor Green
Write-Host "- eas.json: Build profiles" -ForegroundColor Green
Write-Host "- package.json: Build scripts" -ForegroundColor Green

Write-Host ""
Write-Host "Yêu cầu:" -ForegroundColor Yellow
Write-Host "- Apple Developer Account" -ForegroundColor White
Write-Host "- App Store Connect access" -ForegroundColor White
Write-Host "- Bundle Identifier: com.gstnmt.qn" -ForegroundColor White

Write-Host ""
Write-Host "Lệnh build:" -ForegroundColor Magenta
Write-Host "npm run build:ios-preview" -ForegroundColor White
Write-Host "npm run build:ios" -ForegroundColor White
