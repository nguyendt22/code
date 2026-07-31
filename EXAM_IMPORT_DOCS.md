# 📚 EXAM IMPORT SYSTEM - TECHNICAL DOCUMENTATION

## Overview

Hệ thống import đề thi toàn diện với khả năng parse DOCX, extract OMML equations, detect question structure, và validate content.

## 🏗️ Architecture

```
File Upload
    ↓
DocumentParser (Orchestrator)
    ↓
├─ File Validation
├─ DocxParser
│   ├─ Mammoth.js (unzip + parse DOCX)
│   ├─ JSZip (extract images)
│   └─ OMMLConverter (equations → LaTeX)
├─ QuestionDetector
│   ├─ Question number detection
│   ├─ Section detection
│   ├─ Question type classification
│   └─ Choice detection (A/B/C/D)
└─ Validation
    ↓
ExamImportPreview (UI)
    ↓
Teacher Review & Edit
    ↓
Import to Question Bank
```

## 📦 Core Components

### 1. DocumentParser (`src/services/DocumentParser.ts`)
Main orchestrator that:
- Validates file (size, type, exists)
- Routes to appropriate parser (DOCX/PDF)
- Validates parsed document structure
- Returns `DocxParseResult`

**Usage:**
```typescript
const parser = new DocumentParser({
  autoFormatMath: true,
  extractImages: true,
  detectQuestionTypes: true,
  detectSections: true,
  validateStructure: true,
  defaultGrade: 7
});

const result = await parser.parseDocument(file);
if (result.success && result.document) {
  // Show preview
}
```

### 2. DocxParser (`src/services/DocxParser.ts`)
Parses DOCX files using mammoth.js:
- Unzips DOCX (ZIP format)
- Extracts HTML content
- Extracts images from `word/media/`
- Extracts raw XML for equation parsing
- Converts to ContentBlock structure

**Key Features:**
- ✅ Proper DOCX unzip (no more "PK!" garbage)
- ✅ UTF-8 encoding handled correctly
- ✅ Images extracted as Base64
- ✅ Tables preserved
- ✅ Paragraph structure maintained

### 3. QuestionDetector (`src/services/QuestionDetector.ts`)
Detects question structure from content blocks:

**Supported Patterns:**
- `Câu 1.`, `Câu 2:`, `Câu 3)`
- `Question 1.`, `Question 2:`
- `1.`, `2.`, `3.`
- `I.`, `II.`, `III.` (Roman numerals)

**Section Patterns:**
- `PHẦN I`, `PHẦN II`
- `PART 1`, `PART 2`

**Choice Patterns:**
- `A.`, `B.`, `C.`, `D.`
- `a)`, `b)`, `c)`, `d)`

**Question Type Detection:**
- **MCQ4**: Has 4 choices (A/B/C/D)
- **True/False**: Has 2 choices or sub-questions (a/b/c/d)
- **Short Answer**: No choices
- **Essay**: Long text without choices

### 4. OMMLConverter (`src/services/OMMLConverter.ts`)
Converts Office Math Markup Language (OMML) to LaTeX:

**Supported OMML Elements:**
- `<m:f>` → `\frac{num}{den}` (fractions)
- `<m:sup>` → `base^{exp}` (superscripts)
- `<m:sub>` → `base_{sub}` (subscripts)
- `<m:rad>` → `\sqrt{...}` or `\sqrt[n]{...}` (radicals)
- `<m:d>` → `\left( ... \right)` (delimiters)
- `<m:func>` → `\sin`, `\cos`, `\log`, etc.
- `<m:nary>` → `\sum`, `\int`, `\prod` (operators)

**Greek Letters & Symbols:**
- α, β, γ, δ, θ, π, φ, ω → `\alpha`, `\beta`, etc.
- ∞, ≤, ≥, ≠, ±, ×, ÷ → `\infty`, `\leq`, etc.
- →, ←, ↔ → `\rightarrow`, `\leftarrow`, etc.

### 5. ExamImportPreview (`src/components/teacher/ExamImportPreview.tsx`)
UI component for teacher review:

**Features:**
- ✅ Expandable question cards
- ✅ Math rendering with KaTeX
- ✅ Parse status indicators (success/warning/error)
- ✅ Validation issues tab
- ✅ Metadata tab
- ✅ Accept/Cancel actions
- ✅ Question navigation (expand all/collapse all)

**Tabs:**
1. **Preview**: See all questions with proper formatting
2. **Issues**: View errors and warnings
3. **Metadata**: File info, equation count, image count

## 🔧 ContentBlock System

Questions use structured content instead of flat strings:

```typescript
type ContentBlock = 
  | { type: "text"; value: string }
  | { type: "math"; latex?: string; omml?: string; fallbackText?: string }
  | { type: "image"; src: string; alt?: string; isMathEquation?: boolean }
  | { type: "table"; rows: string[][] }
  | { type: "paragraph_break" }
```

**Benefits:**
- Text + Math + Images can coexist
- Order preserved
- Math can be re-rendered independently
- Fallback for failed conversions

## 📝 Question Schema

### EnhancedQuestion (Internal)
```typescript
interface EnhancedQuestion {
  id: string;
  content: ContentBlock[];  // Structured content
  choices?: QuestionChoice[];  // MCQ choices
  subQuestions?: SubQuestion[];  // True/False sub-parts
  parseMetadata: ParseMetadata;  // Parse status
  section?: string;
  sectionOrder?: number;
  originalNumber?: string;  // From document
  orderIndex: number;
  // ... standard Question fields
}
```

### ParseMetadata
```typescript
interface ParseMetadata {
  parseStatus: "success" | "warning" | "error";
  warnings: string[];
  errors: string[];
  confidence: number;  // 0-1
  hasEquations: boolean;
  hasImages: boolean;
  equationCount: number;
  imageCount: number;
}
```

## ✅ Validation Rules

### File Validation
- Max size: 50MB
- Supported: .docx, .doc, .pdf (planned)
- Must not be empty

### Document Validation
- Must have at least 1 question
- Warns on duplicate question numbers
- Warns on gaps in numbering (e.g., Câu 1, 2, 4 - missing 3)
- Warns on empty questions
- Errors on parse failures
- Warns on MCQ without choices

## 🧪 Testing

### Test Case 1: Simple Vietnamese Text
```
Câu 1. Đây là câu hỏi đơn giản.
Câu 2. Tính giá trị của biểu thức 2 + 3.
```

**Expected:**
- 2 questions detected
- No equations
- Parse status: success

### Test Case 2: Math with Fractions
```
Câu 1. Tính giá trị của phân số: x² - 1 / x + 1
```

**Expected:**
- OMML detected (if using Equation Editor)
- Converted to LaTeX: `\frac{x^2 - 1}{x + 1}`
- Rendered properly

### Test Case 3: MCQ Format
```
Câu 1. Kết quả của 2 + 2 là:
A. 3
B. 4
C. 5
D. 6
```

**Expected:**
- Type: mcq4
- 4 choices detected
- Labels: A, B, C, D

### Test Case 4: Sections
```
PHẦN I. TRẮC NGHIỆM
Câu 1. ...

PHẦN II. TỰ LUẬN
Câu 2. ...
```

**Expected:**
- 2 sections detected
- Questions grouped by section

### Test Case 5: Greek Letters
```
Câu 1. Tính sin(π/2)
```

**Expected:**
- π converted to `\pi`
- LaTeX: `\sin(\pi/2)`

## 🚨 Known Limitations

1. **MathType OLE Objects**: Cannot extract directly
   - Fallback: Display as image if embedded
   - Solution: Suggest converting to Word Equation

2. **Complex Tables**: May lose formatting
   - Preserved as simple text grid

3. **Handwritten Equations (Images)**: No OCR
   - Displayed as images
   - Requires manual transcription

4. **PDF Import**: Not yet implemented
   - Use DOCX instead

5. **Old .doc Format**: Uses fallback parser
   - May not extract equations
   - Recommend converting to .docx

## 🔄 Conversion Flow

```
DOCX Binary
    ↓ (mammoth.js)
HTML + Images + Raw XML
    ↓ (DOM Parser)
ContentBlock[] (text/math/image)
    ↓ (QuestionDetector)
DetectedQuestion[] (with structure)
    ↓ (Normalizer)
EnhancedQuestion[] (with metadata)
    ↓ (Validator)
ParsedExamDocument
    ↓ (Preview UI)
Teacher Review
    ↓ (Accept)
Question[] (backward compatible)
```

## 📊 Success Metrics

A successful import has:
- ✅ No "PK!" or garbled text
- ✅ Vietnamese characters display correctly
- ✅ Math equations render properly (not raw XML/text)
- ✅ Images display
- ✅ Question numbers detected
- ✅ Question types identified
- ✅ Choices (A/B/C/D) detected
- ✅ Sections preserved
- ✅ Validation warnings shown
- ✅ Teacher can review before accepting

## 🛠️ Troubleshooting

### Issue: "PK!..." appears
**Cause:** Old parser trying to read binary as text  
**Fix:** Use new DocumentParser (already fixed)

### Issue: Math shows as "[Equation]" or fallback text
**Cause:** OMML conversion failed  
**Fix:** Check OMMLConverter logs, may need manual edit

### Issue: No questions detected
**Cause:** Question numbering not recognized  
**Fix:** Check QUESTION_PATTERNS in QuestionDetector

### Issue: Choices not detected
**Cause:** Format doesn't match A. B. C. D.  
**Fix:** Adjust CHOICE_PATTERNS

### Issue: Images missing
**Cause:** Not extracted from word/media/  
**Fix:** Check DocxParser image extraction

## 📚 Dependencies

- **mammoth** (1.8.0): DOCX to HTML conversion
- **jszip** (3.10.1): Unzip DOCX files
- **katex** (0.18.1): Math rendering
- **react**: UI components
- **lucide-react**: Icons

## 🚀 Future Enhancements

1. PDF import using pdf.js
2. OCR for handwritten equations
3. AI-assisted question type detection
4. Bulk editing in preview
5. Export to other formats
6. MathType deep integration
7. Collaborative review mode
8. Version history for edits

## 📞 Support

If encountering issues:
1. Check browser console for errors
2. Verify file is valid DOCX
3. Check if equations are Word Equations (not MathType OLE)
4. Try copy-paste method as fallback
5. Use Excel import for structured questions

---

**Last Updated:** 2026-07-30  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
