/**
 * AI Triage Service (Phase 1 Interface & Placeholder)
 * 
 * In Phase 2, this module will connect to Gemini / LLM to:
 * 1. Detect language (English, Hindi, Hinglish)
 * 2. Categorize complaint (WATER, LIFT, PARKING, NOISE, CLEANING, MAINTENANCE, OTHER)
 * 3. Evaluate urgency (CRITICAL, HIGH, MEDIUM, LOW)
 * 4. Generate a concise summary
 * 5. Recommend immediate suggested actions for committee
 * 
 * IMPORTANT ARCHITECTURE RULE:
 * Keep all AI triage logic isolated in this service. React components and controllers
 * should never execute direct LLM prompts.
 */

const config = require('../config');

class AiTriageService {
  constructor() {
    this.apiKey = config.ai.apiKey;
    this.model = config.ai.model;
  }

  /**
   * Analyze an incoming complaint and return triaged metadata
   * @param {Object} complaint - { description, flat_number, resident_name }
   * @returns {Promise<Object>} - { category, urgency, language, ai_summary, suggested_action }
   */
  async triageComplaint(complaint) {
    // Phase 1 Placeholder:
    // Returns structured triage structure. In Phase 2, this calls the LLM API.
    const text = (complaint.description || '').toLowerCase();

    // Basic heuristic placeholder for development/hackathon demo
    let detectedCategory = 'OTHER';
    let detectedUrgency = 'MEDIUM';
    let detectedLanguage = 'English';

    // Simple language detection heuristic for mock demo
    if (/[a-zA-Z]/.test(text) && (text.includes('hai') || text.includes('nahi') || text.includes('karo') || text.includes('pani') || text.includes('bohot') || text.includes('subah'))) {
      detectedLanguage = 'Hinglish';
    } else if (/[\u0900-\u097F]/.test(text)) {
      detectedLanguage = 'Hindi';
    }

    // Simple keyword mapping for preview
    if (text.includes('water') || text.includes('paani') || text.includes('pani') || text.includes('leak') || text.includes('motor') || text.includes('pump') || text.includes('tank')) {
      detectedCategory = 'WATER';
      detectedUrgency = (text.includes('urgent') || text.includes('completely') || text.includes('trip')) ? 'CRITICAL' : 'HIGH';
    } else if (text.includes('lift') || text.includes('elevator') || text.includes('stuck') || text.includes('jerk')) {
      detectedCategory = 'LIFT';
      detectedUrgency = text.includes('stuck') ? 'CRITICAL' : 'HIGH';
    } else if (text.includes('park') || text.includes('car') || text.includes('vehicle') || text.includes('gadi') || text.includes('ramp')) {
      detectedCategory = 'PARKING';
      detectedUrgency = text.includes('block') || text.includes('ramp') ? 'HIGH' : 'MEDIUM';
    } else if (text.includes('noise') || text.includes('music') || text.includes('loud') || text.includes('shor') || text.includes('awaz')) {
      detectedCategory = 'NOISE';
      detectedUrgency = 'MEDIUM';
    } else if (text.includes('clean') || text.includes('garbage') || text.includes('kachra') || text.includes('dustbin') || text.includes('smell')) {
      detectedCategory = 'CLEANING';
      detectedUrgency = 'MEDIUM';
    } else if (text.includes('light') || text.includes('switch') || text.includes('bulb') || text.includes('door') || text.includes('gate') || text.includes('repair')) {
      detectedCategory = 'MAINTENANCE';
      detectedUrgency = 'LOW';
    }

    return {
      category: detectedCategory,
      urgency: detectedUrgency,
      language: detectedLanguage,
      ai_summary: `[AI Preview] Complaint regarding ${detectedCategory.toLowerCase()} from flat ${complaint.flat_number || 'N/A'}.`,
      suggested_action: `Check and route to society ${detectedCategory.toLowerCase()} supervisor.`
    };
  }
}

module.exports = new AiTriageService();
