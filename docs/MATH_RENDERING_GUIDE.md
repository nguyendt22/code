# Hướng Dẫn Nhập Công Thức Toán Học - EduMath AI

## 📖 Giới Thiệu

Hệ thống EduMath AI hỗ trợ hiển thị công thức toán học chuyên nghiệp giống như trong sách giáo khoa. Giáo viên có thể nhập công thức bằng nhiều cách khác nhau, hệ thống sẽ tự động chuyển đổi và hiển thị đẹp mắt.

---

## ✅ CÁC CÁCH NHẬP CÔNG THỨC

### 1. Sử Dụng Bàn Phím Mathway (Khuyến Nghị)

Khi tạo hoặc chỉnh sửa câu hỏi, sử dụng **Bàn Phím Mathway** tích hợp sẵn để nhập công thức trực quan:

- **Phân số**: Click nút `a/b` hoặc gõ `\frac{tử}{mẫu}`
- **Căn bậc hai**: Click nút `√` hoặc gõ `\sqrt{biểu thức}`
- **Lũy thừa**: Click nút `x²` hoặc gõ `x^{số mũ}`
- **Xem trước**: Công thức được hiển thị ngay lập tức

### 2. Nhập LaTeX Trực Tiếp

Nếu bạn đã quen với LaTeX, có thể nhập trực tiếp:

```latex
$x^2 + 2x + 1 = 0$          → Công thức inline (trong dòng)
$$\frac{a+b}{c}$$            → Công thức block (dòng riêng, căn giữa)
```

### 3. Nhập Dạng Text Đơn Giản

Hệ thống tự động nhận biết và chuyển đổi:

| Bạn gõ | Hiển thị |
|--------|----------|
| `1/2` | $\frac{1}{2}$ |
| `(x+1)/(x-2)` | $\frac{x+1}{x-2}$ |
| `sqrt(x+1)` | $\sqrt{x+1}$ |
| `x^2` | $x^2$ |

---

## 📚 TRA CỨU NHANH CÚ PHÁP

### Phân Số

```latex
$\frac{tử}{mẫu}$                     → tử/mẫu
$\frac{x+1}{x-2}$                    → (x+1)/(x-2)
$\frac{a^2+b^2}{a+b}$                → (a²+b²)/(a+b)
```

### Căn Bậc

```latex
$\sqrt{x+1}$                         → √(x+1)
$\sqrt[3]{x+1}$                      → ³√(x+1)
$\sqrt[n]{a^n}$                      → ⁿ√(aⁿ)
```

### Lũy Thừa

```latex
$x^2$                                → x²
$a^{n+1}$                            → aⁿ⁺¹
$2^{10}$                             → 2¹⁰
```

### Chỉ Số Dưới

```latex
$x_1, x_2, x_3$                      → x₁, x₂, x₃
$a_n$                                → aₙ
```

### Giá Trị Tuyệt Đối

```latex
$|x-2|$                              → |x-2|
$|2x+3| = 7$                         → |2x+3| = 7
```

### Hệ Phương Trình

```latex
$$\begin{cases}
x + y = 5 \\
2x - y = 1
\end{cases}$$
```

Hiển thị:
```
⎧ x + y = 5
⎨
⎩ 2x - y = 1
```

### Bất Phương Trình

```latex
$2x + 3 > 7$                         → 2x + 3 > 7
$\frac{x-1}{x+2} \le 0$             → (x-1)/(x+2) ≤ 0
```

### Hình Học

```latex
$AB \perp CD$                        → AB ⊥ CD (vuông góc)
$AB \parallel CD$                    → AB ∥ CD (song song)
$\widehat{A} = 60^\circ$            → Â = 60°
$\angle ABC$                         → ∠ABC
$\triangle ABC$                      → △ABC
$\triangle ABC \cong \triangle DEF$ → △ABC ≅ △DEF
```

### Tập Hợp

```latex
$A \subset B$                        → A ⊂ B (tập con)
$x \in A$                            → x ∈ A (thuộc)
$x \notin B$                         → x ∉ B (không thuộc)
$A \cup B$                           → A ∪ B (hợp)
$A \cap B$                           → A ∩ B (giao)
$\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}$ → ℕ, ℤ, ℚ, ℝ
```

### Ký Hiệu Đặc Biệt

```latex
$\pi$                                → π (pi)
$\alpha, \beta, \gamma, \theta$     → α, β, γ, θ
$\Delta$                             → Δ (delta lớn)
$\infty$                             → ∞ (vô cùng)
$\pm$                                → ± (cộng trừ)
$\times$                             → × (nhân)
$\div$                               → ÷ (chia)
$\le, \ge, \neq$                    → ≤, ≥, ≠
```

---

## 💡 TIPS & BEST PRACTICES

### ✅ NÊN LÀM

1. **Sử dụng dấu $ cho công thức inline**
   ```
   Cho $x=2$ và $y=3$. Tính $x+y$.
   ```

2. **Sử dụng $$ cho công thức dài, căn giữa**
   ```
   Giải phương trình:
   $$x^2 - 5x + 6 = 0$$
   ```

3. **Kết hợp text và công thức tự nhiên**
   ```
   Tính diện tích hình chữ nhật có chiều dài $a=5$ cm và chiều rộng $b=3$ cm.
   ```

4. **Sử dụng bàn phím Mathway cho nhanh**
   - Click các nút công thức có sẵn
   - Xem trước ngay lập tức
   - Không cần nhớ cú pháp LaTeX

### ❌ TRÁNH LÀM

1. **Không để công thức dạng text thuần**
   ```
   ❌ SAI: Tính x^2 + 2x + 1
   ✅ ĐÚNG: Tính $x^2 + 2x + 1$
   ```

2. **Không dùng ký hiệu ASCII thay ký hiệu toán**
   ```
   ❌ SAI: AB vuong goc CD
   ✅ ĐÚNG: $AB \perp CD$
   ```

3. **Không nhập phân số dạng 1/2 nếu muốn hiển thị chuyên nghiệp**
   ```
   ❌ KÉM: 1/2 + 3/4
   ✅ TỐT: $\frac{1}{2} + \frac{3}{4}$
   ```

---

## 🎯 VÍ DỤ THỰC TẾ

### Ví Dụ 1: Câu Hỏi Số Hữu Tỉ

**Input:**
```
Tính giá trị biểu thức $\frac{-3}{4} + \frac{1}{2}$
```

**Hiển thị:** Tính giá trị biểu thức $\frac{-3}{4} + \frac{1}{2}$

---

### Ví Dụ 2: Câu Hỏi Tỉ Lệ Thức

**Input:**
```
Cho tỉ lệ thức $\frac{x}{5} = \frac{12}{15}$. Tìm giá trị của $x$.
```

**Hiển thị:** Cho tỉ lệ thức $\frac{x}{5} = \frac{12}{15}$. Tìm giá trị của $x$.

---

### Ví Dụ 3: Câu Hỏi Căn Bậc Hai

**Input:**
```
Tính $\sqrt{81}$
```

**Hiển thị:** Tính $\sqrt{81}$

---

### Ví Dụ 4: Câu Hỏi Hệ Phương Trình

**Input:**
```
Giải hệ phương trình:

$$\begin{cases}
x + y = 5 \\
2x - y = 1
\end{cases}$$
```

**Hiển thị:** 
Giải hệ phương trình:

$$\begin{cases}
x + y = 5 \\
2x - y = 1
\end{cases}$$

---

### Ví Dụ 5: Câu Hỏi Hình Học

**Input:**
```
Cho $\triangle ABC$ vuông tại $A$, có $AB = 3$ cm, $AC = 4$ cm. Tính độ dài cạnh $BC$.
```

**Hiển thị:** Cho $\triangle ABC$ vuông tại $A$, có $AB = 3$ cm, $AC = 4$ cm. Tính độ dài cạnh $BC$.

---

## 🔧 XỬ LÝ SỰ CỐ

### Công thức không hiển thị đúng?

1. **Kiểm tra dấu $ hoặc $$**: Đảm bảo công thức được bọc trong `$...$` hoặc `$$...$$`
2. **Kiểm tra cú pháp LaTeX**: Sử dụng `\frac{a}{b}` thay vì `frac(a,b)`
3. **Sử dụng bàn phím Mathway**: Để tránh lỗi cú pháp
4. **Xem trước trước khi lưu**: Luôn kiểm tra phần "Xem Trước Công Thức"

### Công thức quá dài trên màn hình nhỏ?

- Hệ thống tự động thêm thanh cuộn ngang
- Công thức không bao giờ bị vỡ layout
- Responsive trên mọi thiết bị

### Công thức hiển thị ký tự lạ?

- Kiểm tra encoding file (phải là UTF-8)
- Không copy-paste từ Word/PDF (có thể chứa ký tự đặc biệt)
- Nhập lại bằng bàn phím Mathway

---

## 📱 HỖ TRỢ THIẾT BỊ

### Desktop/Laptop
- Hiển thị tốt nhất
- Font size chuẩn: 1.05em
- Hỗ trợ công thức rất dài

### Tablet
- Font size: 1em
- Tự động điều chỉnh layout
- Scrollbar mỏng cho công thức dài

### Mobile
- Font size: 0.95em
- Công thức rút gọn phù hợp
- Scroll ngang cho công thức rất dài
- Touch-friendly

---

## 🎓 HỌC LATEX CƠ BẢN (5 PHÚT)

Nếu bạn muốn nhập nhanh mà không cần bàn phím Mathway, học 5 lệnh cơ bản sau:

1. **Phân số**: `\frac{tử}{mẫu}`
2. **Căn**: `\sqrt{biểu thức}` hoặc `\sqrt[n]{biểu thức}`
3. **Lũy thừa**: `x^{số mũ}` hoặc `x^2` (nếu số mũ 1 ký tự)
4. **Chỉ số**: `x_{chỉ số}` hoặc `x_1` (nếu chỉ số 1 ký tự)
5. **Inline/Block**: `$...$` inline, `$$...$$` block

**Thế là đủ cho 90% trường hợp!**

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề với công thức toán:
1. Kiểm tra lại các ví dụ trong hướng dẫn này
2. Sử dụng bàn phím Mathway thay vì nhập tay
3. Liên hệ support team nếu vẫn gặp lỗi

---

**Phiên bản:** 1.0  
**Cập nhật:** 2026  
**Tác giả:** EduMath AI Development Team
