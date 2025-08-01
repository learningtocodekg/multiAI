export function processAIMarkup(content) {
  if (!content) return '';
  
  // Handle common AI markup variations
  let processed = content
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    
    // Italic text
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    
    // Code formatting
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-2 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
    
    // Lists
    .replace(/^- (.+)$/gm, '• $1')
    .replace(/^\* (.+)$/gm, '• $1')
    .replace(/^\d+\. (.+)$/gm, '→ $1')
    
    // Headers (convert to bold)
    .replace(/^#{1,6}\s*(.+)$/gm, '<strong>$1</strong>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
    
    // Line breaks
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n/g, '<br>')
    
    .trim();
  
  return processed;
}

// Alternative parser for different AI response formats
export function parseFlexibleResponse(rawResponse) {
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