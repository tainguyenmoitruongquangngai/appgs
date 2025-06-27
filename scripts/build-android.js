#!/usr/bin/env node

/**
 * Build Android APK/AAB Script
 * Script để build Android app với các tùy chọn khác nhau
 */

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Màu sắc cho console
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(
    `\n${colors.bright}[BƯỚC ${step}]${colors.reset} ${colors.cyan}${message}${colors.reset}`
  );
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    log(`\n🚀 ${description}...`, colors.blue);
    log(`📝 Lệnh: ${command}`, colors.yellow);

    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        logError(`Lỗi khi ${description.toLowerCase()}: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr && !stderr.includes("warning")) {
        logError(`Lỗi: ${stderr}`);
        reject(new Error(stderr));
        return;
      }

      logSuccess(`${description} thành công!`);
      if (stdout) {
        console.log(stdout);
      }
      resolve(stdout);
    });

    // Log real-time output
    child.stdout?.on("data", (data) => {
      process.stdout.write(data);
    });

    child.stderr?.on("data", (data) => {
      process.stderr.write(data);
    });
  });
}

async function checkPrerequisites() {
  logStep(1, "Kiểm tra điều kiện tiên quyết");

  try {
    // Kiểm tra EAS CLI
    await runCommand("eas --version", "Kiểm tra EAS CLI");

    // Kiểm tra file cấu hình
    const configFiles = ["eas.json", "app.json", "package.json"];
    for (const file of configFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Không tìm thấy file ${file}`);
      }
      logSuccess(`Tìm thấy ${file}`);
    }

    // Kiểm tra cấu hình eas.json
    const easConfig = JSON.parse(fs.readFileSync("eas.json", "utf8"));
    if (!easConfig.build || !easConfig.build.preview) {
      throw new Error("Không tìm thấy profile preview trong eas.json");
    }
    logSuccess("Cấu hình EAS hợp lệ");
  } catch (error) {
    logError(`Lỗi kiểm tra điều kiện: ${error.message}`);
    process.exit(1);
  }
}

async function buildAndroid(buildType = "apk") {
  logStep(2, `Bắt đầu build Android ${buildType.toUpperCase()}`);

  const profileMap = {
    apk: "preview",
    aab: "production",
  };

  const profile = profileMap[buildType] || "preview";

  try {
    const command = `eas build --platform android --profile ${profile}`;
    await runCommand(command, `Build Android ${buildType.toUpperCase()}`);

    logStep(3, "Kiểm tra trạng thái build");
    await runCommand(
      "eas build:list --platform android --limit 1",
      "Lấy thông tin build mới nhất"
    );
  } catch (error) {
    logError(`Lỗi khi build: ${error.message}`);

    // Gợi ý khắc phục
    logWarning("\n🔧 GỢI Ý KHẮC PHỤC:");
    log("1. Kiểm tra kết nối internet", colors.yellow);
    log("2. Đăng nhập lại EAS: eas login", colors.yellow);
    log("3. Kiểm tra cấu hình eas.json và app.json", colors.yellow);
    log("4. Thử chạy lại: npm run build:android", colors.yellow);

    process.exit(1);
  }
}

async function main() {
  log(`${colors.bright}${colors.magenta}
╔══════════════════════════════════════════════════════════════════╗
║                      🤖 ANDROID BUILD SCRIPT                     ║
║                         QuangNgai App                            ║
╚══════════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const buildType = process.argv[2] || "apk";

  if (!["apk", "aab"].includes(buildType)) {
    logError("Tham số không hợp lệ. Sử dụng: apk hoặc aab");
    log("Ví dụ: node scripts/build-android.js apk", colors.yellow);
    process.exit(1);
  }

  log(`📱 Loại build: ${buildType.toUpperCase()}`, colors.cyan);
  log(
    `⏰ Thời gian bắt đầu: ${new Date().toLocaleString("vi-VN")}`,
    colors.cyan
  );

  try {
    await checkPrerequisites();
    await buildAndroid(buildType);

    logSuccess(`\n🎉 HOÀN THÀNH BUILD ANDROID ${buildType.toUpperCase()}!`);
    log(`\n📋 BƯỚC TIẾP THEO:`, colors.bright);
    log(
      `1. Tải file ${buildType.toUpperCase()} từ link được cung cấp`,
      colors.green
    );
    log(`2. Cài đặt trên thiết bị Android để test`, colors.green);
    if (buildType === "aab") {
      log(`3. Upload lên Google Play Console để phát hành`, colors.green);
    }
  } catch (error) {
    logError(`\n💥 BUILD THẤT BẠI: ${error.message}`);
    process.exit(1);
  }
}

// Chạy script
if (require.main === module) {
  main().catch((error) => {
    logError(`Lỗi không mong đợi: ${error.message}`);
    process.exit(1);
  });
}
