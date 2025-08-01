function parseAIResponse(response, type) {
  const sections = {};
  
  // Extract XML-like sections using regex (flexible matching)
  const patterns = {
    response: /<response[^>]*>([\s\S]*?)<\/response>/i,
    thoughts: /<thoughts[^>]*>([\s\S]*?)<\/thoughts>/i,
    confidence_score: /<confidence_score[^>]*>([\s\S]*?)<\/confidence_score>/i,
    collaboration_note: /<collaboration_note[^>]*>([\s\S]*?)<\/collaboration_note>/i,
    ready_status: /<ready_status[^>]*>([\s\S]*?)<\/ready_status>/i,
    review: /<review[^>]*>([\s\S]*?)<\/review>/i,
    improvements_needed: /<improvements_needed[^>]*>([\s\S]*?)<\/improvements_needed>/i,
    revised_response: /<revised_response[^>]*>([\s\S]*?)<\/revised_response>/i,
    personality_focus: /<personality_focus[^>]*>([\s\S]*?)<\/personality_focus>/i,
    analysis: /<analysis[^>]*>([\s\S]*?)<\/analysis>/i,
    changes_made: /<changes_made[^>]*>([\s\S]*?)<\/changes_made>/i
  };
  
  // Alternative patterns for different AI markup styles
  const alternativePatterns = {
    response: /\*\*Response:\*\*([\s\S]*?)(?=\*\*|$)/i,
    thoughts: /\*\*Thoughts:\*\*([\s\S]*?)(?=\*\*|$)/i,
    confidence_score: /\*\*Confidence[^:]*:\*\*\s*(\d+)/i,
    ready_status: /\*\*Ready[^:]*:\*\*\s*(READY|NOT_READY)/i
  };
  
  // Try primary patterns first
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = response.match(pattern);
    sections[key] = match ? match[1].trim() : '';
  }
  
  // Fallback to alternative patterns if primary failed
  for (const [key, pattern] of Object.entries(alternativePatterns)) {
    if (!sections[key] || sections[key] === '') {
      const match = response.match(pattern);
      sections[key] = match ? match[1].trim() : '';
    }
  }
  
  // Handle different confidence score formats
  if (sections.confidence_score) {
    const confMatch = sections.confidence_score.match(/(\d+)/);
    sections.confidence_score = confMatch ? parseInt(confMatch[1]) : 5;
  }
  
  // Clean up markdown artifacts that AIs sometimes add
  Object.keys(sections).forEach(key => {
    if (sections[key]) {
      sections[key] = sections[key]
        .replace(/^\*\*[^*]+\*\*:?\s*/i, '') // Remove bold headers
        .replace(/^#+\s*/gm, '') // Remove markdown headers
        .replace(/^\s*[-*]\s*/gm, '') // Clean bullet points
        .trim();
    }
  });
  
  return sections;
}

// Utility for cleaning and processing various AI markup formats
function processAIMarkup(content) {
  if (!content) return '';
  
  // Handle common AI markup variations
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>') // Inline code
    .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-2 rounded text-sm overflow-x-auto"><code>$1</code></pre>') // Code blocks
    .replace(/^- (.+)$/gm, '• $1') // Clean bullet points
    .replace(/^\d+\. (.+)$/gm, '→ $1') // Clean numbered lists
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .replace(/\n/g, '<br>') // Convert line breaks to HTML
    .trim();
}

// Alternative parser for different AI response formats
function parseFlexibleResponse(rawResponse) {
  const sections = {};
  
  // Try multiple parsing strategies
  const strategies = [
    parseXMLTags,
    parseMarkdownHeaders,
    parseBoldHeaders,
    parseColonSeparated
  ];
  
  for (const strategy of strategies) {
    const result = strategy(rawResponse);
    if (result && Object.keys(result).length > 0) {
      Object.assign(sections, result);
    }
  }
  
  return sections;
}

function parseXMLTags(content) {
  const sections = {};
  const patterns = {
    response: /<(?:response|answer)[^>]*>([\s\S]*?)<\/(?:response|answer)>/i,
    thoughts: /<(?:thoughts|reasoning)[^>]*>([\s\S]*?)<\/(?:thoughts|reasoning)>/i,
    confidence_score: /<(?:confidence|score)[^>]*>([\s\S]*?)<\/(?:confidence|score)>/i,
    ready_status: /<(?:ready|status)[^>]*>([\s\S]*?)<\/(?:ready|status)>/i
  };
  
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = content.match(pattern);
    if (match) sections[key] = match[1].trim();
  }
  
  return sections;
}

function parseMarkdownHeaders(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent = [];
  
  for (const line of lines) {
    if (line.match(/^#{1,6}\s*(Response|Thoughts|Confidence|Ready)/i)) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.replace(/^#{1,6}\s*/, '').toLowerCase().replace(/\s+/g, '_');
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return sections;
}

function parseBoldHeaders(content) {
  const sections = {};
  const patterns = {
    response: /\*\*(?:Response|Answer):\*\*([\s\S]*?)(?=\*\*|$)/i,
    thoughts: /\*\*(?:Thoughts|Reasoning):\*\*([\s\S]*?)(?=\*\*|$)/i,
    confidence_score: /\*\*(?:Confidence|Score):\*\*\s*(\d+)/i,
    ready_status: /\*\*(?:Ready|Status):\*\*\s*(READY|NOT_READY)/i
  };
  
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = content.match(pattern);
    if (match) sections[key] = match[1].trim();
  }
  
  return sections;
}

function parseColonSeparated(content) {
  const sections = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim().toLowerCase().replace(/\s+/g, '_');
      const value = line.substring(colonIndex + 1).trim();
      if (value) sections[key] = value;
    }
  }
  
  return sections;
}

module.exports = {
  parseAIResponse,
  processAIMarkup,
  parseFlexibleResponse
}; 