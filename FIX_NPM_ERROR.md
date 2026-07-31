# 🔧 FIX NPM ERROR 404

## Vấn đề bạn gặp phải

```
npm error 404 tarball, folder, http url, or git url
```

## Nguyên nhân

1. **Lỗi syntax trong install-deps.bat** (đã fix)
2. **npm version cũ** (npm 10.9.8, mới nhất là 12.0.2)
3. **Package version không tồn tại trên npm registry**

---

## ✅ GIẢI PHÁP: CHẠY TRỰC TIẾP

### Cách 1: Mở Command Prompt (CMD) - KHUYẾN NGHỊ

1. Nhấn **Windows + R**
2. Gõ: `cmd`
3. Enter

Trong CMD, chạy:

```cmd
cd C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs

npm install
```

**CHỜ 2-3 PHÚT** (sẽ cài tất cả dependencies từ package.json)

---

### Cách 2: Update npm version trước (Tùy chọn)

```cmd
npm install -g npm@latest
```

Sau đó:

```cmd
cd C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs
npm install
```

---

### Cách 3: Dùng yarn thay vì npm (Nếu có)

```cmd
cd C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs
yarn install
```

---

## ✅ KIỂM TRA THÀNH CÔNG

Sau khi chạy `npm install` xong, check:

```cmd
dir node_modules\mammoth
```

Nếu thấy:
```
Directory of C:\Users\LENOVO\...\node_modules\mammoth
```

→ ✅ **THÀNH CÔNG!**

---

## 🚀 TEST NGAY

```cmd
npm run dev
```

Mở browser:
```
http://localhost:5000
```

Test upload DOCX như hướng dẫn trong QUICK_START.md

---

## ❌ NẾU VẪN LỖI

### Lỗi: "PowerShell execution policy"

**Không dùng PowerShell! Dùng CMD thay vì.**

### Lỗi: "npm không được nhận dạng"

Node.js chưa cài hoặc chưa trong PATH.

**Fix:**
1. Download Node.js: https://nodejs.org/
2. Cài đặt (chọn "Add to PATH")
3. Restart CMD
4. Thử lại

### Lỗi: "EACCES permission denied"

**Fix:**
```cmd
npm cache clean --force
npm install
```

### Lỗi: Network/Registry issues

**Fix:**
```cmd
npm config set registry https://registry.npmjs.org/
npm install
```

---

## 📝 DEPENDENCIES CẦN CÀI

Từ package.json:

```json
{
  "mammoth": "^1.8.0",
  "jszip": "^3.10.1",
  "@types/mammoth": "^1.0.5"
}
```

Cùng với tất cả dependencies khác (react, vite, katex, etc.)

---

## ⚡ QUICK SOLUTION

**Chỉ cần chạy dòng này trong CMD:**

```cmd
cd C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs && npm install
```

**Xong!**

---

## 🆘 VẪN KHÔNG ĐƯỢC?

Thử clear cache và reinstall:

```cmd
cd C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs

del /s /q node_modules
del package-lock.json

npm cache clean --force

npm install
```

---

**Sau khi cài xong, quay lại QUICK_START.md để test!**
