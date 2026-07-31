# 🐛 DEBUG GUIDE - Tìm Lỗi DOCX Import

## 🎯 MỤC ĐÍCH

Tìm chính xác lỗi ở đâu:
1. Choice detection không hoạt động?
2. Image extraction thất bại?
3. OMML conversion bị lỗi?

---

## 📋 CHUẨN BỊ

### Bước 1: Reload code mới (CÓ LOGGING)

**QUAN TRỌNG:** Code mới có extensive logging!

#### Option A: Hard reload browser
```
Ctrl + Shift + R
```

#### Option B: Restart server
1. Đóng server CMD (Ctrl+C)
2. Chạy lại `CHAY_SERVER.bat`
3. Đợi "listening on http://0.0.0.0:3000"
4. Mở browser mới: http://localhost:3000

---

## 🧪 TEST VỚI CONSOLE MỞ

### Bước 1: Mở Browser Console TRƯỚC KHI UPLOAD

**Nhấn:** `Ctrl + Shift + I`

**Hoặc:** Chuột phải → Inspect → Tab Console

---

### Bước 2: Upload DOCX

1. Login **Teacher**
2. **"Tạo Đề Thi"** → Tab **"Câu Hỏi"**
3. **"Upload DOCX"**
4. **QUAN SÁT Console output!**

---

## 📊 LOGS MÀ BẠN SẼ THẤY

### 1. DocxParser Logs

```
📄 Step 1: Extracting DOCX content with mammoth...
  ✅ HTML length: XXXX, Images: Y, XML length: ZZZZ

📐 Step 2: Extracting OMML equations...
  ✅ Found X OMML equations

🧩 Step 3: Parsing HTML to ContentBlocks...
  ✅ Created XX content blocks
  📊 Block types: {text: 20, image: 3, math: 5, paragraph_break: 15}

🖼️  Found X images in paragraph
  ✅ Image 1: src length = 5000, starts with "data:image/png;base64,iVBOR..."
  OR
  ⚠️ Image 1: NO SRC attribute!

📐 Processing X equations for LaTeX conversion...
  ✅ Equation 1: LaTeX = "\frac{x}{2} + 3..."
  OR
  ⚠️ Equation 1: Conversion FAILED, using fallback

🔍 Step 4: Detecting questions...
  ✅ Detected X questions
```

### 2. QuestionDetector Logs

```
✅ Found choice: A - "huy chương Vàng, Bạc và Đồng"
✅ Found SECOND choice on same line: B - "huy chương Vàng, Đồng"
✅ Found choice: C - "huy chương Vàng, Bạc"
✅ Found choice: D - "số lượng huy chương"

🔍 QuestionDetector: Processed 50 blocks, detected 6 questions
  Q1: "1" with 0 choices, type: short_answer
  Q2: "2" with 4 choices, type: mcq4
  Q3: "3" with 2 choices, type: mcq4
```

---

## 🔍 PHÂN TÍCH LOGS

### Case 1: Choices vẫn không tách

**Logs sẽ thấy:**
```
✅ Found choice: A - "huy chương Vàng, Bạc và Đồng. B. huy chương Vàng, Đồng."
❌ KHÔNG THẤY "Found SECOND choice"
```

**→ Lỗi:** Pattern matching regex không match được choice thứ 2

**→ Giải pháp:** Cần improve regex hoặc text preprocessing

---

### Case 2: Images không hiển thị

**Check logs:**

#### Nếu thấy:
```
🖼️  Found 0 images in paragraph
```
**→ Mammoth KHÔNG extract được images từ DOCX!**

**Nguyên nhân:**
- File DOCX có image format không support (EMF, WMF)
- Image embedded bằng OLE object
- Mammoth config bị lỗi

#### Nếu thấy:
```
🖼️  Found 3 images in paragraph
  ⚠️ Image 1: NO SRC attribute!
```
**→ Mammoth convert image nhưng KHÔNG có data!**

**Nguyên nhân:**
- `convertImage` callback bị lỗi
- Base64 encoding failed

#### Nếu thấy:
```
🖼️  Found 3 images in paragraph
  ✅ Image 1: src length = 5000, starts with "data:image/png..."
```
**→ Image data CÓ RỒI! Nhưng preview không render!**

**Nguyên nhân:**
- ExamImportPreview component không render image blocks
- CSS ẩn images
- React render issue

---

### Case 3: Math không hiển thị

**Check logs:**

#### Nếu thấy:
```
📐 Step 2: Extracting OMML equations...
  ✅ Found 0 OMML equations
```
**→ KHÔNG có OMML trong DOCX!**

**Nguyên nhân:**
- File Word dùng MathType OLD format (không phải OMML)
- Equation là IMAGE chứ không phải object

#### Nếu thấy:
```
📐 Found 5 OMML equations
📐 Processing 5 equations for LaTeX conversion...
  ⚠️ Equation 1: Conversion FAILED, using fallback
  ❌ OMML conversion ERROR: ...
```
**→ OMML parse failed!**

**Nguyên nhân:**
- OMMLConverter có bug
- OMML format không support
- XML parse error

#### Nếu thấy:
```
📐 Processing 5 equations for LaTeX conversion...
  ✅ Equation 1: LaTeX = "\frac{x}{2}..."
```
**→ Conversion SUCCESS! Nhưng preview không render!**

**Nguyên nhân:**
- MathRenderer component lỗi
- KaTeX không load
- LaTeX syntax invalid

---

## 📸 GỬI CHO TÔI

### 1. Screenshot Console (FULL)

Expand tất cả logs, chụp từ đầu đến cuối.

---

### 2. Paste Text Logs

Copy từ Console:
```
Right-click trong Console → Select All → Copy
```

Paste vào text file gửi cho tôi.

---

### 3. File DOCX Mẫu

Gửi file DOCX bạn đang test (nếu không nhạy cảm).

---

## 🎯 CHECKLIST

Upload DOCX và tick các mục bạn thấy trong Console:

- [ ] `✅ HTML length: XXXX` - Mammoth extract HTML OK
- [ ] `✅ Found X images` - Image extraction OK
- [ ] `✅ Image 1: src length = XXXX` - Image có data
- [ ] `✅ Found X OMML equations` - OMML detected
- [ ] `✅ Equation 1: LaTeX = "..."` - OMML → LaTeX OK
- [ ] `✅ Found choice: A - "..."` - Choice detection OK
- [ ] `✅ Found SECOND choice on same line` - Multi-choice OK
- [ ] `Q2: "2" with 4 choices, type: mcq4` - Question structure OK

---

## 🚨 NẾU KHÔNG THẤY LOGS

**→ Code mới CHƯA LOAD!**

**Fix:**
1. Clear browser cache: `Ctrl + Shift + Delete` → Clear all
2. Restart server: Ctrl+C, chạy lại `CHAY_SERVER.bat`
3. Hard reload: `Ctrl + Shift + R`
4. Test lại

---

**TEST NGAY VÀ GỬI LOGS CHO TÔI!** 🐛🔍
