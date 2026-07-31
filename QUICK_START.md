# 🚀 QUICK START - DOCX IMPORT TESTING

## ⚠️ BƯỚC 1: CÀI ĐẶT DEPENDENCIES (BẮT BUỘC)

Code mới cần 2 thư viện:
- **mammoth** (1.8.0) - Parse DOCX files
- **jszip** (3.10.1) - Unzip DOCX files

### Cách 1: Double-click file
```
📁 install-deps.bat
```
→ Double-click và chờ 1-2 phút

### Cách 2: Command line
```bash
cd C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs
npm install
```

### Cách 3: Chỉ cài 2 packages cần thiết
```bash
npm install mammoth@^1.8.0 jszip@^3.10.1
```

---

## ✅ BƯỚC 2: KIỂM TRA ĐÃ CÀI THÀNH CÔNG

Chạy lệnh này:
```bash
dir node_modules\mammoth
```

Nếu thấy thư mục → ✅ Thành công!  
Nếu không thấy → ❌ Chưa cài, quay lại Bước 1

---

## 🧪 BƯỚC 3: TEST LOCAL

### A. Chạy dev server
```bash
npm run dev
```

### B. Mở browser
```
http://localhost:5000
```

### C. Test DOCX Import
1. Login as **Teacher**
2. Click **"Tạo Đề Thi"** (màu xanh)
3. Tab **"Câu Hỏi"**
4. Click **"Upload DOCX"** (màu xám)
5. Chọn file DOCX của bạn

### D. Kiểm tra Preview
- ✅ Không còn "PK!" hoặc ký tự lạ
- ✅ Tiếng Việt hiển thị đúng
- ✅ Công thức toán render đẹp (không phải raw text)
- ✅ Câu hỏi được đánh số đúng
- ✅ A/B/C/D được detect
- ✅ Có thể expand/collapse từng câu

### E. Accept Import
- Click **"Chấp Nhận & Import X Câu"**
- Verify câu hỏi được thêm vào đề thi

---

## 🌐 BƯỚC 4: TEST PRODUCTION (VERCEL)

### A. Check deployment status
```
https://vercel.com/dashboard
```
Đợi "Building..." → "Ready"

### B. Open live site
```
https://code-eta-jet.vercel.app
```

### C. Hard refresh
```
Ctrl + Shift + R
```
(Xóa cache cũ)

### D. Test như local
Giống Bước 3C-E

---

## 📝 TEST CASES

### Test 1: Simple Vietnamese Text
Tạo file `test1.docx`:
```
Câu 1. Đây là câu hỏi đơn giản.
Câu 2. Tính 2 + 3.
```

**Expected:**
- 2 questions detected
- Vietnamese OK
- No math

### Test 2: With Math Equations
Tạo file `test2.docx` trong Word:
```
Câu 1. Giải phương trình x² - 4 = 0

(Use Word Equation Editor to insert x² properly)
```

**Expected:**
- Math detected
- Equation shows as beautiful rendered math
- Not raw "x^2"

### Test 3: MCQ Format
```
Câu 1. Kết quả của 2 + 2 là:
A. 3
B. 4
C. 5
D. 6
```

**Expected:**
- Type: MCQ4
- 4 choices detected
- A, B, C, D labels correct

### Test 4: With Sections
```
PHẦN I. TRẮC NGHIỆM
Câu 1. ...

PHẦN II. TỰ LUẬN
Câu 2. ...
```

**Expected:**
- 2 sections detected
- Questions grouped

### Test 5: Fractions
Dùng Word Equation Editor insert:
```
x - 1
─────
x + 1
```

**Expected:**
- Shows as proper fraction with horizontal bar
- LaTeX: `\frac{x-1}{x+1}`

---

## ❌ TROUBLESHOOTING

### Lỗi: "Module not found: mammoth"
**Nguyên nhân:** Chưa cài dependencies  
**Fix:** Chạy `install-deps.bat` hoặc `npm install`

### Lỗi: "PowerShell execution policy"
**Fix:**
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Lỗi: Still shows "PK!..." 
**Nguyên nhân:** Cache cũ hoặc code chưa deploy  
**Fix:**
1. Hard refresh: `Ctrl + Shift + R`
2. Check Vercel đã deploy commit mới chưa
3. Xóa browser cache

### Lỗi: Math shows as "[Equation]" text
**Nguyên nhân:** 
- OMML conversion failed
- Hoặc không phải Word Equation (có thể là MathType OLE)

**Fix:**
- Check console log
- Try copy-paste method
- Or manual edit after import

### Lỗi: No questions detected
**Nguyên nhân:** Question numbering không match pattern  
**Fix:**
- Ensure format: "Câu 1." or "Question 1." or "1."
- Check EXAM_IMPORT_DOCS.md for supported patterns

---

## 📞 NEED HELP?

1. Check browser console (F12)
2. Check terminal/server logs
3. Review EXAM_IMPORT_DOCS.md
4. Check test cases above

---

## ✅ SUCCESS CHECKLIST

Before marking as "done":

- [ ] Dependencies installed (`node_modules/mammoth` exists)
- [ ] Dev server runs without errors
- [ ] Upload DOCX button works
- [ ] No "PK!" garbage appears
- [ ] Vietnamese displays correctly
- [ ] Math equations render properly
- [ ] Questions detected
- [ ] Choices (A/B/C/D) detected
- [ ] Preview modal shows
- [ ] Can expand/collapse questions
- [ ] Accept & Import works
- [ ] Questions added to exam list

If all ✅ → **SYSTEM WORKS!** 🎉

---

**Last Updated:** 2026-07-30  
**Quick Start Guide v1.0**
