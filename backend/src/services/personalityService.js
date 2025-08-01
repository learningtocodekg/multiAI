const PERSONALITY_CYCLE = [
  'INITIAL_GENERATOR',
  'CRITICAL_REVIEWER',
  'HUMANIZER',
  'CREATIVITY_ENHANCER', 
  'READABILITY_OPTIMIZER',
  'REDUNDANCY_CHECKER',
  'ACCURACY_VALIDATOR',
  'COMPLETENESS_AUDITOR',
  'TONE_REFINER',
  'FINAL_POLISH'
];

const PERSONALITY_DESCRIPTIONS = {
  INITIAL_GENERATOR: 'Focus on comprehensive coverage, solid foundation, thorough exploration of the topic',
  CRITICAL_REVIEWER: 'Be thorough, identify weaknesses, gaps, inaccuracies, and areas needing improvement',
  HUMANIZER: 'Make content more relatable, conversational, and human-friendly',
  CREATIVITY_ENHANCER: 'Add innovative ideas, creative approaches, and fresh perspectives',
  READABILITY_OPTIMIZER: 'Improve clarity, flow, structure, and ease of understanding',
  REDUNDANCY_CHECKER: 'Eliminate repetition, tighten content, remove unnecessary elements',
  ACCURACY_VALIDATOR: 'Fact-check, verify information, ensure correctness',
  COMPLETENESS_AUDITOR: 'Ensure all aspects are covered, nothing important is missing',
  TONE_REFINER: 'Adjust voice, style, and tone for the intended audience',
  FINAL_POLISH: 'Last refinement for professional quality and excellence'
};

class PersonalityService {
  constructor() {
    this.personalities = PERSONALITY_CYCLE;
    this.descriptions = PERSONALITY_DESCRIPTIONS;
  }
  
  getNextPersonality(currentIteration) {
    if (currentIteration >= this.personalities.length) {
      return 'FINAL_POLISH';
    }
    return this.personalities[currentIteration];
  }
  
  getPersonalityDescription(personality) {
    return this.descriptions[personality] || 'General AI assistant';
  }
  
  getAllPersonalities() {
    return this.personalities;
  }
  
  getPersonalityIndex(personality) {
    return this.personalities.indexOf(personality);
  }
  
  isLastPersonality(personality) {
    return personality === 'FINAL_POLISH';
  }
  
  getPersonalityCount() {
    return this.personalities.length;
  }
}

module.exports = PersonalityService; 