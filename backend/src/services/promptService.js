const PersonalityService = require('./personalityService');

class PromptService {
  constructor() {
    this.personalityService = new PersonalityService();
  }
  
  generatePromptImproverPrompt(userPrompt) {
    return `You are an expert prompt engineer. Transform the user's prompt to maximize AI response quality.

Enhance by:
- Adding clarity and specific context
- Including success criteria
- Structuring for optimal AI understanding
- Adding relevant constraints
- Maintaining original intent

Original prompt: ${userPrompt}

Return ONLY the improved prompt. No explanations or meta-commentary.`;
  }
  
  generateInitialGeneratorPrompt(improvedPrompt) {
    return `You are AI Model 1 in a collaborative AI system. You'll create a comprehensive first draft, then another AI model will review and improve your work.

Context: ${improvedPrompt}
Personality: INITIAL GENERATOR - Focus on comprehensive coverage, solid foundation, thorough exploration of the topic.

Provide response in this EXACT format:

<response>
[Your comprehensive initial answer to the prompt]
</response>

<thoughts>
[Your reasoning, approach, and areas you focused on]
</thoughts>

<confidence_score>
[Number 1-10] - Your confidence in this response's quality
</confidence_score>

<collaboration_note>
[What you'd like the other AI model to focus on reviewing/improving]
</collaboration_note>

<ready_status>
NOT_READY
</ready_status>`;
  }
  
  generateCriticalReviewerPrompt(improvedPrompt, previousResponse, previousThoughts, previousCollaborationNote, previousConfidence, conversationHistory, currentModelName, otherModelName) {
    return `You are ${currentModelName} in a collaborative AI system. You're reviewing work created by ${otherModelName} and providing critical feedback to improve it.

Original prompt: ${improvedPrompt}
${otherModelName}'s response: ${previousResponse}
${otherModelName}'s thoughts: ${previousThoughts}
${otherModelName}'s collaboration note: ${previousCollaborationNote}
${otherModelName}'s confidence: ${previousConfidence}
Full conversation history: ${conversationHistory}

Personality: CRITICAL REVIEWER - Be thorough, identify weaknesses, gaps, inaccuracies, and areas needing improvement.

You are NOT the same AI that created the previous response. You are a different AI model with a different perspective and expertise. Review the work as if it was created by a colleague that you're helping to improve.

Respond in this EXACT format:

<review>
[Detailed critical analysis of ${otherModelName}'s response - what works, what doesn't, what's missing]
</review>

<improvements_needed>
[Specific areas that need enhancement or correction]
</improvements_needed>

<revised_response>
[Your improved version of the response based on critical analysis]
</revised_response>

<thoughts>
[Your reasoning for the changes and critical observations]
</thoughts>

<confidence_score>
[Number 1-10] - Your confidence in this revised response
</confidence_score>

<collaboration_note>
[What you'd like ${otherModelName} to focus on in the next iteration]
</collaboration_note>

<ready_status>
[READY/NOT_READY] - Whether you think this is ready for the user
</ready_status>`;
  }
  
  generatePersonalityPrompt(improvedPrompt, currentResponse, conversationHistory, personality, iteration, previousPersonality, previousConfidence, currentModelName, otherModelName) {
    const personalityDescription = this.personalityService.getPersonalityDescription(personality);
    
    return `You are ${currentModelName} in a collaborative AI system. You're reviewing and improving work created by ${otherModelName} using your unique perspective and expertise.

Original prompt: ${improvedPrompt}
Current response (created by ${otherModelName}): ${currentResponse}
Full conversation history: ${conversationHistory}
${otherModelName}'s previous personality: ${previousPersonality}
${otherModelName}'s previous confidence: ${previousConfidence}
Iteration count: ${iteration}/6

Personality: ${personality} - ${personalityDescription}

You are NOT the same AI that created the previous responses. You are a different AI model with different strengths and perspectives. You're collaborating with ${otherModelName} to create the best possible response.

PERSONALITY DESCRIPTIONS:
- HUMANIZER: Make content more relatable, conversational, and human-friendly
- CREATIVITY_ENHANCER: Add innovative ideas, creative approaches, and fresh perspectives
- READABILITY_OPTIMIZER: Improve clarity, flow, structure, and ease of understanding
- REDUNDANCY_CHECKER: Eliminate repetition, tighten content, remove unnecessary elements
- ACCURACY_VALIDATOR: Fact-check, verify information, ensure correctness
- COMPLETENESS_AUDITOR: Ensure all aspects are covered, nothing important is missing
- TONE_REFINER: Adjust voice, style, and tone for the intended audience
- FINAL_POLISH: Last refinement for professional quality and excellence

Respond in this EXACT format:

<personality_focus>
[What you're focusing on as this personality when reviewing ${otherModelName}'s work]
</personality_focus>

<analysis>
[Your analysis from this personality's perspective of ${otherModelName}'s work]
</analysis>

<revised_response>
[Your improved version applying this personality's strengths to ${otherModelName}'s work]
</revised_response>

<changes_made>
[Specific changes you made to ${otherModelName}'s work and why]
</changes_made>

<thoughts>
[Your reasoning and this personality's observations about ${otherModelName}'s work]
</thoughts>

<confidence_score>
[Number 1-10] - Your confidence in this revised response
</confidence_score>

<collaboration_note>
[What you'd like ${otherModelName} to focus on in the next iteration, or if you think it's complete]
</collaboration_note>

<ready_status>
[READY/NOT_READY] - Whether you think this is ready for the user
</ready_status>`;
  }
  
  generateSummaryPrompt(exchanges) {
    const exchangeSummaries = exchanges.map((exchange, index) => {
      return `Exchange ${index + 1} (${exchange.model} - ${exchange.personality || 'Unknown'}):
- Confidence: ${exchange.confidence_score || 'N/A'}/10
- Focus: ${exchange.personality_focus || 'General improvement'}
- Key changes: ${exchange.changes_made || 'None specified'}
- Status: ${exchange.ready_status || 'Unknown'}`;
    }).join('\n\n');
    
    return `Create a concise summary of the AI collaboration session between two different AI models based on the following exchanges:

${exchangeSummaries}

Provide a summary that includes:
1. Overall improvement trajectory through collaboration
2. Key contributions from each AI model
3. How the different perspectives enhanced the final result
4. Final confidence level
5. Main areas of enhancement
6. Collaboration effectiveness between the two AI models

Keep the summary under 200 words and focus on the most important insights about the collaborative process.`;
  }
}

module.exports = PromptService; 