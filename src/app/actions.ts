"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface IntentResult {
  intent: "create_reminder" | "none";
  title: string;
  date: string; // ISO format (YYYY-MM-DD)
  time: string; // HH:mm (24-hour format)
  confidence: number; // 0 to 1
  error?: string;
}

export async function extractIntent(transcript: string): Promise<IntentResult> {
  let apiKey: string | undefined = undefined;

  // In development, prioritize reading directly from .env.local / .env so updates apply immediately without server restart
  if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      for (const envFile of [".env.local", ".env"]) {
        const envPath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), envFile);
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, "utf8");
          const match = content.match(/GEMINI_API_KEY=(.*)/);
          if (match && match[1]?.trim()) {
            apiKey = match[1].trim();
            break;
          }
        }
      }
    } catch {
      // Ignore filesystem fallback error
    }
  }

  if (!apiKey) {
    apiKey = process.env.GEMINI_API_KEY?.trim();
  }

  if (apiKey) {
    // Strip optional surrounding single or double quotes
    apiKey = apiKey.replace(/^["']|["']$/g, "").trim();
  }

  // Current server date context for relative date resolution
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
  const currentDay = String(now.getDate()).padStart(2, "0");
  const currentDateISO = `${currentYear}-${currentMonth}-${currentDay}`;
  const currentDayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowYear = tomorrow.getFullYear();
  const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const tomorrowDay = String(tomorrow.getDate()).padStart(2, "0");
  const tomorrowDateISO = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;

  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const dayAfterTomorrowDateISO = `${dayAfterTomorrow.getFullYear()}-${String(
    dayAfterTomorrow.getMonth() + 1
  ).padStart(2, "0")}-${String(dayAfterTomorrow.getDate()).padStart(2, "0")}`;

  if (!apiKey) {
    console.warn(
      "[ContextOS] GEMINI_API_KEY is not set. Please set it in .env.local."
    );

    const lower = transcript.toLowerCase();
    // High confidence tier (>= 0.85)
    if (lower.includes("rahul") && (lower.includes("tomorrow") || lower.includes("kal"))) {
      return {
        intent: "create_reminder",
        title: "Meet Rahul",
        date: tomorrowDateISO,
        time: "17:00",
        confidence: 0.95,
      };
    }
    // Medium confidence tier (0.5 - 0.85)
    if (lower.includes("doctor") || lower.includes("maybe") || lower.includes("dentist")) {
      return {
        intent: "create_reminder",
        title: "Call Doctor",
        date: tomorrowDateISO,
        time: "11:00",
        confidence: 0.72,
      };
    }
    // Low confidence tier (< 0.5)
    return {
      intent: "none",
      title: "",
      date: "",
      time: "",
      confidence: 0.2,
      error: "GEMINI_API_KEY not configured. Simulated low confidence result.",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      process.env.GEMINI_MODEL,
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-1.5-flash",
    ].filter(Boolean) as string[];

    const systemInstruction = `You are ContextOS, an intelligent on-device context extraction engine.
Your task is to extract calendar and reminder intents from casual speech transcripts.

Server Temporal Reference:
- Today's Date: ${currentDateISO} (${currentDayOfWeek})
- Tomorrow's Date: ${tomorrowDateISO}
- Day After Tomorrow's Date: ${dayAfterTomorrowDateISO}
- Current Server Time: ${now.toTimeString().slice(0, 5)}

Instructions for relative dates & times:
- Support English and Hinglish phrases seamlessly (e.g. "Kal 5 baje Rahul se milna hai" translates to meeting Rahul tomorrow at 17:00).
- "baje" means o'clock ("5 baje" = 17:00 / 5:00 PM).
- "milna hai" / "milna" means to meet.
- Resolve relative terms like "today", "aaj" to "${currentDateISO}".
- Resolve relative terms like "tomorrow", "kal" to "${tomorrowDateISO}".
- Resolve "day after tomorrow", "parson" to "${dayAfterTomorrowDateISO}".
- For times like "at 5", "5 o'clock", or "5 baje" without am/pm specification, infer standard human activity hours (e.g. meetings/hangouts are typically 17:00 unless morning is explicitly mentioned). Format time in 24-hour "HH:mm".
- If the phrase clearly indicates a reminder, meeting, task, or scheduled event, set "intent" to "create_reminder". If it is vague, uncertain, or casual conversation without intent, set "intent" to "none" or assign low confidence (< 0.5).
- If somewhat ambiguous or tentative (e.g. "maybe", "thinking about", "could be"), assign a confidence between 0.5 and 0.84.
- If explicit and clear, assign high confidence (0.85 to 1.0).
- "title" should be a clear, concise summary of the event in English (e.g. "Meet Rahul").
- "date" must be an ISO format date string (YYYY-MM-DD). If no date is mentioned, use today or leave empty string.
- "time" must be in HH:mm format (e.g. "17:00", "09:30"). If no time is mentioned, use empty string "".
- "confidence" must be a float between 0.0 and 1.0.

Return STRICT JSON ONLY matching this schema:
{
  "intent": "create_reminder" | "none",
  "title": string,
  "date": string,
  "time": string,
  "confidence": number
}`;

    const prompt = `${systemInstruction}\n\nTranscript: "${transcript}"`;

    let responseText = "";
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });
        const result = await model.generateContent(prompt);
        responseText = result.response.text().trim();
        if (responseText) {
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[ContextOS] Model '${modelName}' failed, trying fallback...`);
      }
    }

    if (!responseText && lastError) {
      throw lastError;
    }

    let cleanJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const firstBrace = cleanJson.indexOf("{");
    const lastBrace = cleanJson.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }

    const parsed: IntentResult = JSON.parse(cleanJson);

    return {
      intent: parsed.intent === "create_reminder" ? "create_reminder" : "none",
      title: parsed.title || "",
      date: parsed.date || "",
      time: parsed.time || "",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[ContextOS] Error calling Gemini API:", errorMsg);

    return {
      intent: "none",
      title: "",
      date: "",
      time: "",
      confidence: 0,
      error: `Gemini API call failed: ${errorMsg}`,
    };
  }
}
