/**
 * AI Triage Service (Phase 2 - Real Gemini AI Complaint Triage)
 * 
 * Uses @google/genai package and Gemini Interactions API with gemini-3.8-flash
 * to analyze resident complaints in English, Hindi, and Hinglish.
 */

const { GoogleGenAI } = require('@google/genai');
const config = require('../config');

const ALLOWED_CATEGORIES = ['WATER', 'LIFT', 'PARKING', 'NOISE', 'CLEANING', 'MAINTENANCE', 'OTHER'];
const ALLOWED_URGENCIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const ALLOWED_LANGUAGES = ['English', 'Hindi', 'Hinglish', 'Other'];

class AiTriageService {
  constructor() {
    this.apiKey = config.gemini.apiKey || process.env.GEMINI_API_KEY || '';
    this.model = 'gemini-3.8-flash';
    this.client = null;

    if (this.apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey: this.apiKey });
        console.log('[AI Triage] Gemini client initialized with model:', this.model);
      } catch (err) {
        console.warn('[AI Triage] Failed to initialize Gemini client:', err.message);
      }
    } else {
      console.warn('[AI Triage] GEMINI_API_KEY is not set. Safe fallbacks will be used.');
    }
  }

  /**
   * Helper to normalize category to exact allowed enum
   */
  normalizeCategory(raw) {
    if (!raw || typeof raw !== 'string') return 'OTHER';
    const clean = raw.trim().toUpperCase();
    if (ALLOWED_CATEGORIES.includes(clean)) return clean;
    if (clean.includes('WATER') || clean.includes('PANI') || clean.includes('PAANI')) return 'WATER';
    if (clean.includes('LIFT') || clean.includes('ELEVATOR')) return 'LIFT';
    if (clean.includes('PARK') || clean.includes('CAR') || clean.includes('VEHICLE')) return 'PARKING';
    if (clean.includes('NOISE') || clean.includes('SOUND') || clean.includes('MUSIC')) return 'NOISE';
    if (clean.includes('CLEAN') || clean.includes('GARBAGE') || clean.includes('KACHRA')) return 'CLEANING';
    if (clean.includes('MAINT') || clean.includes('REPAIR') || clean.includes('LIGHT')) return 'MAINTENANCE';
    return 'OTHER';
  }

  /**
   * Helper to normalize urgency to exact allowed enum
   */
  normalizeUrgency(raw) {
    if (!raw || typeof raw !== 'string') return 'MEDIUM';
    const clean = raw.trim().toUpperCase();
    if (ALLOWED_URGENCIES.includes(clean)) return clean;
    if (clean.includes('CRIT') || clean.includes('EMERGENCY') || clean.includes('DANGER') || clean.includes('TRAPPED')) return 'CRITICAL';
    if (clean.includes('HIGH')) return 'HIGH';
    if (clean.includes('LOW')) return 'LOW';
    return 'MEDIUM';
  }

  /**
   * Helper to normalize language
   */
  normalizeLanguage(raw) {
    if (!raw || typeof raw !== 'string') return 'Other';
    const clean = raw.trim().toLowerCase();
    if (clean.includes('hinglish')) return 'Hinglish';
    if (clean.includes('hindi')) return 'Hindi';
    if (clean.includes('english')) return 'English';
    return 'Other';
  }

  /**
   * Safe fallback response if Gemini fails or is unavailable
   */
  getFallbackResult(complaint) {
    const text = complaint?.description || '';
    const flat = complaint?.flat_number || 'N/A';

    return {
      category: 'OTHER',
      urgency: 'MEDIUM',
      language: 'Other',
      summary: text ? (text.length > 120 ? text.slice(0, 117) + '...' : text) : `Complaint received from Flat ${flat}.`,
      suggested_action: 'Review complaint description and assign to relevant committee member.',
      is_fallback: true
    };
  }

  /**
   * Analyze an incoming complaint and return triaged metadata
   * @param {Object} complaint - { description, flat_number, resident_name }
   * @returns {Promise<Object>} - { category, urgency, language, summary, suggested_action, ai_summary }
   */
  async triageComplaint(complaint) {
    if (!complaint || !complaint.description || !complaint.description.trim()) {
      return this.getFallbackResult(complaint);
    }

    // Lazy initialization if client was not ready at startup
    if (!this.client) {
      const currentKey = config.gemini.apiKey || process.env.GEMINI_API_KEY;
      if (currentKey) {
        try {
          this.client = new GoogleGenAI({ apiKey: currentKey });
        } catch (e) {
          console.warn('[AI Triage] Re-init error:', e.message);
        }
      }

      if (!this.client) {
        console.warn('[AI Triage] Gemini client unavailable. Using fallback triage.');
        const fallback = this.getFallbackResult(complaint);
        return { ...fallback, ai_summary: fallback.summary };
      }
    }

    const description = complaint.description.trim();
    const flat = complaint.flat_number || 'N/A';
    const resident = complaint.resident_name || 'Resident';

    const prompt = `You are an expert AI triage assistant for a residential housing society (~100 flats).
Residents submit complaints in English, Hindi, or Hinglish (Hindi written in Roman/English alphabet).

Analyze the resident complaint carefully and return a JSON object with:
- "category": Must be EXACTLY ONE of: "WATER", "LIFT", "PARKING", "NOISE", "CLEANING", "MAINTENANCE", "OTHER".
- "urgency": Must be EXACTLY ONE of: "CRITICAL", "HIGH", "MEDIUM", "LOW".
  * CRITICAL: Immediate safety risk, person trapped, severe emergency, major access/safety danger (e.g. person stuck in lift).
  * HIGH: Major service disruption or issue requiring prompt action (e.g. entire wing water stopped, car blocking wheelchair/stretcher access ramp).
  * MEDIUM: Important issue but not an immediate emergency (e.g. overflowing garbage bin, late night music).
  * LOW: Routine maintenance or non-urgent issue (e.g. routine corridor cleaning missed, minor fixture repair).
  Do NOT automatically classify every complaint as critical.
- "language": Must be EXACTLY ONE of: "English", "Hindi", "Hinglish", "Other".
  * Hindi: written in Devanagari script.
  * Hinglish: Hindi words written in English letters (e.g. "paani nahi aa raha", "lift mein uncle phas gaye").
  * English: standard English.
- "summary": 1 concise, factual sentence summarizing the issue. Never invent facts.
- "suggested_action": 1 practical next step for the society committee or maintenance staff.

Complaint to triage:
Resident: "${resident}"
Flat: "${flat}"
Description: "${description}"

Return ONLY valid JSON with keys: category, urgency, language, summary, suggested_action.`;

    try {
      // 60-second timeout safeguard to ensure the server never hangs
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out after 60s')), 60000)
      );

      const response = await Promise.race([
        this.client.interactions.create({
          model: this.model,
          input: prompt
        }),
        timeoutPromise
      ]);

      const rawText = response?.output_text || '';
      if (!rawText.trim()) {
        throw new Error('Gemini returned an empty response');
      }

      // Clean raw text in case of markdown formatting
      let cleanedJson = rawText.trim();
      const codeBlockMatch = cleanedJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        cleanedJson = codeBlockMatch[1].trim();
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
      }

      const parsed = JSON.parse(cleanedJson);

      const category = this.normalizeCategory(parsed.category);
      const urgency = this.normalizeUrgency(parsed.urgency);
      const language = this.normalizeLanguage(parsed.language);
      const summary = typeof parsed.summary === 'string' && parsed.summary.trim()
        ? parsed.summary.trim()
        : `Complaint reported by flat ${flat}.`;
      const suggested_action = typeof parsed.suggested_action === 'string' && parsed.suggested_action.trim()
        ? parsed.suggested_action.trim()
        : 'Review issue and assign to maintenance staff.';

      return {
        category,
        urgency,
        language,
        summary,
        suggested_action,
        ai_summary: summary,
        is_fallback: false
      };
    } catch (err) {
      console.error('[AI Triage] Gemini API call error:', err.message);
      const fallback = this.getFallbackResult(complaint);
      return {
        ...fallback,
        ai_summary: fallback.summary
      };
    }
  }
}

module.exports = new AiTriageService();
