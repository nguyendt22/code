# 🔥 CRITICAL FIX - REGEX BUG!

## 🐛 Root Cause:

```typescript
// BUG:
const hasSubQuestions = choices.some(c => /^[a-d]$/i.test(c.label));
                                                    ^^
                                              'i' flag = case-insensitive!
```

→ `/^[a-d]$/i` match **CẢ uppercase A/B/C/D!**

→ Tất cả questions với A/B/C/D bị coi là **sub-questions**!

→ Type = `short_answer` thay vì `mcq4`!

---

## ✅ Fixed:

```typescript
// FIXED: Remove 'i' flag
const hasSubQuestions = choices.some(c => /^[a-d]$/.test(c.label));
                                                   ^^
                                             No 'i' flag!
```

→ Chỉ match **lowercase a/b/c/d**

→ A/B/C/D → `type: mcq4` ✅

---

## 🔄 Test ngay:

1. **Restart server:** `AUTO_FULL_RESET_TEST.bat`
2. **Upload DOCX**
3. **Check logs:**
   ```
   ✅ Detected 4 main choices (uppercase A/B/C/D) → type: mcq4
   📊 Finalized Q with 4 choices → type: mcq4
   ```

---

## 📊 Before vs After:

### BEFORE (BUG):
```
Found choice: A
Found choice: B
Found choice: C
Found choice: D
❌ Detected sub-questions (a/b/c/d format) → type: short_answer
```

### AFTER (FIXED):
```
Found choice: A
Found choice: B
Found choice: C
Found choice: D
✅ Detected 4 main choices (uppercase A/B/C/D) → type: mcq4
```

---

**FIXED!** 🎉
