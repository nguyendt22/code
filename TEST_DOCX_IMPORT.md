# 🧪 TEST DOCX IMPORT - Hướng Dẫn

## ✅ Đã Fix Gì?

### 1. **Question Detection** - Nhận dạng câu hỏi
- ✅ Tách từng câu hỏi riêng biệt (không còn dính thành 1 câu)
- ✅ Nhận dạng số thứ tự: `Câu 1`, `Question 1`, `1.`, `I.`
- ✅ Phát hiện sections: `PHẦN I`, `PART 1`

### 2. **OMML to LaTeX Conversion** - Chuyển đổi công thức toán
- ✅ Parse OMML (Office Math XML) từ DOCX
- ✅ Convert sang LaTeX để render qua KaTeX
- ✅ Hỗ trợ:
  - Phân số: `\frac{a}{b}`
  - Mũ: `x^{2}`, subscript: `x_{i}`
  - Căn bậc hai: `\sqrt{x}`, `\sqrt[n]{x}`
  - Dấu ngoặc: `\left( ... \right)`
  - Functions: `\sin`, `\cos`, `\log`
  - Ký hiệu Hy Lạp: `\alpha`, `\beta`, `\pi`
  - Tổng/tích phân: `\sum`, `\int`

### 3. **Better Line Breaks** - Tách dòng tốt hơn
- ✅ Mỗi paragraph `<p>` thành 1 ContentBlock riêng
- ✅ Giữ nguyên cấu trúc văn bản

### 4. **Choice Detection** - Nhận dạng đáp án
- ✅ Phát hiện A/B/C/D (uppercase)
- ✅ Phát hiện a/b/c/d (lowercase - sub-questions)
- ✅ Auto-detect question type: MCQ4, True/False

---

## 🔄 Cách Test

### Bước 1: Reload trang (nếu đang mở)

Trong browser (`http://localhost:3000`):

```
Ctrl + Shift + R
```

Hoặc đóng server CMD (Ctrl+C), chạy lại `CHAY_SERVER.bat`

---

### Bước 2: Upload DOCX

1. Login as **Teacher**
2. Click **"Tạo Đề Thi"**
3. Tab **"Câu Hỏi"**
4. Click **"Upload DOCX"**
5. Chọn file DOCX

---

### Bước 3: Kiểm tra Preview Modal

#### ✅ Phải thấy:

**Câu hỏi được tách riêng:**
```
Câu 1: Nếu tung một đồng xu 24 lần liên tiếp...
  [Expand để xem content]

Câu 2: Biểu đồ dưới đây được biểu diễn bằng...
  [Expand để xem content]

Câu 3: Trong các phân số bên dưới, phân số bằng phân số...
  [Expand để xem content]
```

**Công thức toán render đẹp:**
```
x² - 4 = 0   (không phải x^2 - 4 = 0 dạng text)
√(x + 1)     (không phải sqrt(x + 1))
a/b          (render dạng phân số đứng)
```

**Choices được detect:**
```
A. x = ±2
B. x = 2
C. x = -2  
D. Vô nghiệm
```

**Metadata tab:**
```
✅ Số câu hỏi: X
✅ Equations: Y
✅ Images: Z
```

---

### Bước 4: Accept Import

Click **"Chấp Nhận & Import X Câu"**

Verify câu hỏi xuất hiện trong danh sách!

---

## 🐛 Nếu Vẫn Có Lỗi

### 1. Câu hỏi vẫn dính thành 1 câu?

**Kiểm tra:**
- File DOCX có đánh số câu không? (`Câu 1.`, `1.`, etc.)
- Mỗi câu có xuống dòng riêng không?

**Fix:** Định dạng lại file Word với format:
```
Câu 1. [nội dung câu 1]
A. [đáp án A]
B. [đáp án B]

Câu 2. [nội dung câu 2]
A. [đáp án A]
...
```

---

### 2. Công thức toán không hiện?

**Kiểm tra:**
- Mở Browser Console (Ctrl+Shift+I)
- Xem có lỗi OMML conversion không

**Debug:**
- Chụp màn hình Console errors
- Gửi cho tôi

---

### 3. Có message "[Equation X]" thay vì math?

**Nguyên nhân:** OMML không convert được

**Workaround:** Công thức đó quá phức tạp, cần improve OMMLConverter

---

## 📊 Kết Quả Mong Đợi

### ❌ TRƯỚC (Old system):
```
Upload DOCX
  ↓
"PK!��Content_Types].xml..." 
  ↓
1 câu dính tất cả text
Không có math
GARBAGE ❌
```

### ✅ SAU (New system):
```
Upload DOCX
  ↓
Preview Modal
  ↓
Câu 1: [content]
  ✅ Math: x² + 2x + 1 = 0
  ✅ Choices: A/B/C/D
  
Câu 2: [content]
  ✅ Math: ∫₀¹ f(x)dx
  ✅ Choices: A/B/C/D
  
PERFECT! 🎉
```

---

## 🎯 Test Cases

### Test 1: Simple Math
```
Câu 1. Giải phương trình x² - 4 = 0
A. x = ±2
B. x = 2
C. x = -2
D. Vô nghiệm
```

**Expected:**
- ✅ Detected as Câu 1
- ✅ Math: x^{2} - 4 = 0 rendered
- ✅ 4 choices A/B/C/D
- ✅ Type: mcq4

---

### Test 2: Fraction
```
Câu 2. Tính giá trị của a/b + c/d
```

**Expected:**
- ✅ Fractions render as \\frac{a}{b} + \\frac{c}{d}

---

### Test 3: Square Root
```
Câu 3. Tính √(x + 1)
```

**Expected:**
- ✅ Render as \\sqrt{x + 1}

---

## 📸 Chụp Màn Hình Để Debug

Nếu có vấn đề, gửi cho tôi:

1. **Preview Modal** - toàn bộ
2. **Browser Console** (Ctrl+Shift+I) - các dòng đỏ
3. **Server CMD window** - output logs
4. **File DOCX mẫu** - để tôi test

---

## 🚀 NEXT STEPS

Sau khi test thành công, chúng ta sẽ:

1. ✅ Improve OMMLConverter cho các công thức phức tạp hơn
2. ✅ Add MathType equation image detection
3. ✅ Add correct answer auto-detection
4. ✅ Add explanation extraction
5. ✅ Improve UI/UX for preview modal

---

**TEST NGAY VÀ BÁO KẾT QUẢ!** 🎯
