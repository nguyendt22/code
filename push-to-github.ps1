# Script tự động đẩy code lên GitHub
# Chạy script này trong PowerShell

$ErrorActionPreference = "Stop"

Write-Host "=== BẮT ĐẦU ĐẨY CODE LÊN GITHUB ===" -ForegroundColor Green

# Di chuyển vào thư mục project
Set-Location "C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs"

# Kiểm tra git đã cài đặt chưa
try {
    git --version | Out-Null
    Write-Host "✓ Git đã được cài đặt" -ForegroundColor Green
} catch {
    Write-Host "✗ Git chưa được cài đặt. Vui lòng cài đặt từ https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Khởi tạo git repository (nếu chưa có)
if (-not (Test-Path ".git")) {
    Write-Host "Khởi tạo git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Đã khởi tạo git repository" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository đã tồn tại" -ForegroundColor Green
}

# Kiểm tra và thêm remote origin
$remoteExists = git remote | Select-String "origin"
if (-not $remoteExists) {
    Write-Host "Thêm remote origin..." -ForegroundColor Yellow
    git remote add origin https://github.com/nguyendt22/code.git
    Write-Host "✓ Đã thêm remote origin" -ForegroundColor Green
} else {
    Write-Host "✓ Remote origin đã tồn tại" -ForegroundColor Green
    # Cập nhật URL nếu cần
    git remote set-url origin https://github.com/nguyendt22/code.git
}

# Thêm tất cả file vào staging
Write-Host "Thêm tất cả file..." -ForegroundColor Yellow
git add .

# Kiểm tra xem có thay đổi nào không
$status = git status --porcelain
if ($status) {
    Write-Host "✓ Có file cần commit" -ForegroundColor Green
    
    # Commit
    Write-Host "Tạo commit..." -ForegroundColor Yellow
    git commit -m "Initial commit - EduMath AI platform"
    Write-Host "✓ Đã tạo commit" -ForegroundColor Green
} else {
    Write-Host "✓ Không có thay đổi mới, sử dụng commit hiện tại" -ForegroundColor Green
}

# Đổi tên branch thành main
Write-Host "Đổi tên branch thành main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Đã đổi tên branch" -ForegroundColor Green

# Push lên GitHub với force
Write-Host "Đẩy code lên GitHub..." -ForegroundColor Yellow
Write-Host "LƯU Ý: Nếu được hỏi username và password:" -ForegroundColor Cyan
Write-Host "  - Username: nguyendt22" -ForegroundColor Cyan
Write-Host "  - Password: Dùng Personal Access Token (không phải password thật)" -ForegroundColor Cyan
Write-Host "  - Tạo token tại: https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host ""

try {
    git push -u origin main --force
    Write-Host ""
    Write-Host "=== THÀNH CÔNG! CODE ĐÃ ĐƯỢC ĐẨY LÊN GITHUB ===" -ForegroundColor Green
    Write-Host "Xem tại: https://github.com/nguyendt22/code" -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "✗ Lỗi khi push lên GitHub" -ForegroundColor Red
    Write-Host "Lỗi: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Các giải pháp:" -ForegroundColor Yellow
    Write-Host "1. Kiểm tra kết nối internet" -ForegroundColor Yellow
    Write-Host "2. Đảm bảo đã đăng nhập GitHub (dùng Personal Access Token)" -ForegroundColor Yellow
    Write-Host "3. Kiểm tra repository https://github.com/nguyendt22/code có tồn tại" -ForegroundColor Yellow
    exit 1
}
