import { base44 } from '@/api/base44Client';

// ============================================================
// MULTI-AGENT RESEARCH SYSTEM
// ============================================================

function createLog(agent, action, status = 'running') {
  return {
    agent,
    action,
    timestamp: new Date().toISOString(),
    status
  };
}

// ---- MANAGER AGENT ----
async function managerAgent(topic) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a Research Manager Agent. Your job is to create a detailed execution plan for researching the topic: "${topic}".

Create a structured plan with:
1. Key research questions to answer (5-7 questions)
2. Search queries to use (5-8 specific queries)
3. Areas to focus on: trends, opportunities, risks, key players, statistics
4. Expected deliverables

Be specific and actionable. This plan will guide a research team.`,
    response_json_schema: {
      type: "object",
      properties: {
        research_questions: {
          type: "array",
          items: { type: "string" }
        },
        search_queries: {
          type: "array",
          items: { type: "string" }
        },
        focus_areas: {
          type: "array",
          items: { type: "string" }
        },
        plan_summary: { type: "string" }
      }
    }
  });
  return result;
}

// ---- RESEARCH AGENT ----
async function researchAgent(topic, searchQueries, retryCount = 0) {
  const maxRetries = 3;
  
  const combinedQuery = `${topic}: ${searchQueries.slice(0, 4).join(', ')}`;
  
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a Research Agent. Research the following topic thoroughly using web information.

Topic: "${topic}"

Search for information about:
${searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Provide comprehensive research findings including:
- Key facts and statistics (with specific numbers when available)
- Recent developments (2024-2026)
- Major players and organizations involved
- Expert opinions and quotes
- Relevant data points
- Source references

Be thorough and factual. Include specific details, dates, and numbers.`,
    add_context_from_internet: true,
    model: "gemini_3_flash",
    response_json_schema: {
      type: "object",
      properties: {
        findings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              topic_area: { type: "string" },
              content: { type: "string" },
              key_stats: { type: "array", items: { type: "string" } }
            }
          }
        },
        sources: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              url: { type: "string" },
              snippet: { type: "string" }
            }
          }
        },
        raw_summary: { type: "string" }
      }
    }
  });

  // Self-correction: if findings are too sparse, retry
  if (result.findings && result.findings.length < 2 && retryCount < maxRetries) {
    return researchAgent(topic, searchQueries, retryCount + 1);
  }

  return result;
}

// ---- SUMMARIZER AGENT ----
async function summarizerAgent(topic, researchData, retryCount = 0) {
  const maxRetries = 2;
  
  const findingsText = researchData.findings
    ? researchData.findings.map(f => `## ${f.topic_area}\n${f.content}\nStats: ${(f.key_stats || []).join(', ')}`).join('\n\n')
    : researchData.raw_summary || 'No detailed findings available.';

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a Summarizer Agent. Analyze the following research findings on "${topic}" and produce a comprehensive, structured analysis.

RESEARCH DATA:
${findingsText}

Create a detailed analysis with these sections. Each section should be substantive (at least 3-4 paragraphs or 8-10 bullet points):

1. EXECUTIVE SUMMARY: A comprehensive overview (200-300 words)
2. KEY FINDINGS: The most important discoveries (8-12 detailed bullet points)
3. CURRENT TRENDS: What's happening now and emerging patterns (6-10 trends)
4. OPPORTUNITIES: Areas of potential growth and advantage (6-8 opportunities)
5. RISKS AND CHALLENGES: Potential obstacles and concerns (6-8 risks)
6. CONCLUSION: Strategic recommendations and outlook (150-200 words)

Use professional language. Include specific data points and statistics where available. Be analytical, not just descriptive.`,
    model: "gemini_3_flash",
    response_json_schema: {
      type: "object",
      properties: {
        executive_summary: { type: "string" },
        key_findings: { type: "string" },
        current_trends: { type: "string" },
        opportunities: { type: "string" },
        risks_challenges: { type: "string" },
        conclusion: { type: "string" }
      }
    }
  });

  // Self-correction: check if summary is too short
  const totalLength = Object.values(result).join('').length;
  if (totalLength < 500 && retryCount < maxRetries) {
    return summarizerAgent(topic, researchData, retryCount + 1);
  }

  return result;
}

// ---- ORCHESTRATOR ----
export async function runResearchCrew(topic, onProgress) {
  const startTime = Date.now();
  const logs = [];
  
  const addLog = (agent, action, status = 'running') => {
    const log = createLog(agent, action, status);
    logs.push(log);
    if (onProgress) onProgress({ logs: [...logs], currentStep: agent });
  };

  // Step 1: Manager Agent
  addLog('Manager Agent', 'Creating research execution plan...');
  let plan;
  try {
    plan = await managerAgent(topic);
    addLog('Manager Agent', `Plan created with ${plan.search_queries?.length || 0} search queries`, 'completed');
  } catch (err) {
    addLog('Manager Agent', 'Failed to create plan, using fallback', 'warning');
    plan = {
      search_queries: [
        `${topic} latest developments 2025`,
        `${topic} industry trends`,
        `${topic} opportunities and challenges`,
        `${topic} statistics and data`,
        `${topic} future outlook`
      ],
      research_questions: [],
      focus_areas: ['trends', 'opportunities', 'risks']
    };
  }

  // Step 2: Research Agent
  addLog('Research Agent', 'Performing web research...');
  let research;
  try {
    research = await researchAgent(topic, plan.search_queries || []);
    addLog('Research Agent', `Found ${research.findings?.length || 0} research areas with ${research.sources?.length || 0} sources`, 'completed');
  } catch (err) {
    addLog('Research Agent', 'Web search failed, using LLM knowledge as fallback', 'warning');
    research = {
      findings: [],
      sources: [],
      raw_summary: `Research on ${topic} based on available knowledge.`
    };
  }

  // Step 3: Summarizer Agent
  addLog('Summarizer Agent', 'Analyzing findings and generating summary...');
  let summary;
  try {
    summary = await summarizerAgent(topic, research);
    addLog('Summarizer Agent', 'Analysis complete', 'completed');
  } catch (err) {
    addLog('Summarizer Agent', 'Summary generation failed', 'failed');
    throw new Error('Failed to generate research summary');
  }

  // Step 4: Compile results
  addLog('Report Agent', 'Compiling final report...', 'running');
  
  const duration = Math.round((Date.now() - startTime) / 1000);
  addLog('Report Agent', `Report compiled in ${duration}s`, 'completed');

  return {
    topic,
    ...summary,
    sources: research.sources || [],
    agent_logs: logs,
    duration_seconds: duration
  };
}