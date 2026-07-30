import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", appName: "EduMath AI", time: new Date().toISOString() });
  });

  // Server-side Gemini API Integration
  app.post("/api/ai/analyze-error", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          success: true,
          isMock: true,
          analysis: {
            rootCause: "Học sinh đang nhầm lẫn quy tắc dấu khi thực hiện phép chia phân số âm hoặc rút gọn phân số chưa về dạng tối giản.",
            knowledgeGap: "Quy tắc dấu trong chia phân số & Rút gọn phân số (Toán 7 - Chương 1)",
            recommendation: "Ôn lại lý thuyết quy tắc dấu và làm 5 câu bài tập cơ bản củng cố thực hành.",
            suggestedExerciseTypes: ["Thực hiện phép tính phân số âm", "Rút gọn biểu thức chứa phân số"]
          }
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { questionText, studentAnswer, correctAnswer, topicName } = req.body;

      const prompt = `Bạn là chuyên gia sư phạm Toán THCS (Việt Nam).
Hãy phân tích câu trả lời sai của học sinh dưới đây:
- Chủ đề: ${topicName || "Chưa xác định"}
- Đề bài: ${questionText}
- Đáp án của học sinh: ${studentAnswer}
- Đáp án đúng: ${correctAnswer}

Trả về định dạng JSON với các trường:
1. "rootCause": Nguyên nhân gây ra lỗi (học sinh đang nhầm lẫn điều gì).
2. "knowledgeGap": Kiến thức cốt lõi bị hổng.
3. "recommendation": Lời khuyên cụ thể cho học sinh ôn lại.
4. "suggestedExerciseTypes": Danh sách 2-3 dạng bài tập nên làm lại.

Chỉ trả về JSON thuần túy, không có Markdown formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      let text = response.text || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(text);

      res.json({ success: true, isMock: false, analysis: parsed });
    } catch (err: any) {
      console.error("Gemini Error Analysis Error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to analyze error pattern" });
    }
  });

  app.post("/api/ai/extract-doc", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { docTitle, contentSnippet } = req.body;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          success: true,
          isMock: true,
          data: {
            grade: "Lớp 7",
            chapter: "Chương 2: Số thực và tỉ lệ thức",
            extractedKeyPoints: [
              "Định nghĩa tỉ lệ thức và tính chất $a/b = c/d \\Rightarrow ad = bc$",
              "Dãy tỷ số bằng nhau và ứng dụng bài toán chia phần",
              "Biểu diễn căn bậc hai đại số"
            ],
            generatedQuestions: [
              {
                text: "Cho tỉ lệ thức $\\frac{x}{3} = \\frac{8}{6}$. Giá trị của $x$ là:",
                options: ["A. $x = 4$", "B. $x = 16$", "C. $x = 24$", "D. $x = 2$"],
                correctIndex: 0,
                explanation: "Ta có $x = \\frac{3 \\times 8}{6} = 4$.",
                cognitiveLevel: "Thông hiểu",
                difficulty: "Trung bình"
              },
              {
                text: "Giá trị của $\\sqrt{49}$ bằng bao nhiêu?",
                options: ["A. -7", "B. 7", "C. $\\pm 7$", "D. 49"],
                correctIndex: 1,
                explanation: "Căn bậc hai số học của 49 là 7 vì $7^2 = 49$ và $7 > 0$.",
                cognitiveLevel: "Nhận biết",
                difficulty: "Dễ"
              }
            ]
          }
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Bạn là trợ lý AI cho giáo viên Toán THCS.
Dựa vào nội dung tài liệu sau:
Tên tài liệu: ${docTitle}
Nội dung trích đoạn: ${contentSnippet}

Hãy phân tích và tạo bài tập Toán phù hợp. Trả về JSON chứa:
1. grade: Lớp (Lớp 6, Lớp 7, hoặc Lớp 8)
2. chapter: Tên chương phù hợp
3. extractedKeyPoints: Mảng chuỗi các kiến thức trọng tâm
4. generatedQuestions: Mảng các câu hỏi gồm text, options (4 lựa chọn), correctIndex (0-3), explanation, cognitiveLevel (Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao), difficulty (Dễ/Trung bình/Khó).

Chỉ trả về JSON thuần túy.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      let text = response.text || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(text);

      res.json({ success: true, isMock: false, data: parsed });
    } catch (err: any) {
      console.error("Gemini Doc Extraction Error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to process document" });
    }
  });

  // Vite development or static distribution serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduMath AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
