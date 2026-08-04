// AI Service Layer for Questify
// Utilizes OpenRouter API to access Gemini models for generation tasks.

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
// Using Gemini 1.5 Flash via OpenRouter for fast, cheap JSON generation
const DEFAULT_MODEL = "google/gemma-4-26b-a4b-it:free"

// Fallback key if not provided (though security.md dictates environment variables)
const getApiKey = () => import.meta.env.VITE_OPENROUTER_API_KEY || ""

interface FetchOptions extends RequestInit {
  timeoutMs?: number
  retries?: number
  retryDelayMs?: number
}

/**
 * Generic fetch wrapper that adds timeout and exponential backoff retry logic.
 */
async function fetchWithRetry(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeoutMs = 15000, retries = 2, retryDelayMs = 1000, ...fetchOptions } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })
      
      clearTimeout(id)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response
    } catch (error: unknown) {
      clearTimeout(id)
      
      const err = error instanceof Error ? error : new Error(String(error))
      lastError = err
      
      if (err.name === 'AbortError') {
        console.warn(`[AI Service] Attempt ${attempt + 1} timed out.`)
      } else {
        console.warn(`[AI Service] Attempt ${attempt + 1} failed:`, err.message)
      }

      if (attempt < retries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryDelayMs * Math.pow(2, attempt)))
      }
    }
  }

  throw new Error(`Fetch failed after ${retries + 1} attempts. Last error: ${lastError?.message}`)
}

/**
 * Calls OpenRouter Chat Completions API with a specific prompt and JSON enforcement.
 */
async function callOpenRouter(systemPrompt: string, userMessage: string, timeoutMs = 15000) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error("Missing VITE_OPENROUTER_API_KEY environment variable.")
  }

  const payload = {
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    response_format: { type: "json_object" }
  }

  const response = await fetchWithRetry(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin, // OpenRouter requirement
      "X-Title": "Questify", // OpenRouter requirement
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    timeoutMs,
    retries: 2,
    retryDelayMs: 1500
  })

  const data = await response.json()
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error("Invalid response from AI service.")
  }

  const content = data.choices[0].message.content
  try {
    return JSON.parse(content)
  } catch {
    throw new Error("AI returned malformed JSON.")
  }
}

// --- Domain Specific Generation Methods ---

interface QuestNodeData {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  isBoss: boolean
}

export interface QuestMap {
  nodes: QuestNodeData[]
  worldName: string
}

/**
 * Parses syllabus text into a sequence of Quest Nodes.
 */
export async function generateQuest(syllabusText: string): Promise<QuestMap> {
  const prompt = `You are a curriculum designer for a retro RPG game.
Your task is to take the following syllabus or learning material text and turn it into a structured "Quest Map".
ALL OUTPUT TEXT MUST BE IN INDONESIAN (BAHASA INDONESIA).

Extract the main topics into a sequential array of learning nodes. The first node should be available, the others locked, and the final node must be a boss node.

Text:
${syllabusText.substring(0, 5000)}

Output strictly in the following JSON format:
{
  "worldName": "Nama Dunia (e.g. Hutan HTML, Gua Python)",
  "nodes": [
    {
      "id": "1",
      "title": "Nama Quest (e.g. Pengenalan Dasar)",
      "description": "Deskripsi quest ini",
      "difficulty": "easy" | "medium" | "hard",
      "isBoss": boolean
    }
  ]
}`
  
  return await callOpenRouter(prompt, syllabusText, 25000) as QuestMap
}

export interface LearningSummary {
  content: string
  keyPoints: string[]
}

/**
 * Generates an ancient scroll summary for a specific quest topic.
 */
export async function generateSummary(topicTitle: string, syllabusContext: string): Promise<LearningSummary> {
  const prompt = `You are an AI scholar in a retro RPG game.
The player has encountered a quest node titled: "${topicTitle}".
Context: ${syllabusContext}
ALL OUTPUT TEXT MUST BE IN INDONESIAN (BAHASA INDONESIA).

Provide a learning summary in the following JSON format:
{
  "content": "Penjelasan utama materi secara naratif dan menarik layaknya sebuah cerita pendek RPG (2-3 paragraf)",
  "keyPoints": [
    "Poin penting 1",
    "Poin penting 2",
    "Poin penting 3"
  ]
}`

  return await callOpenRouter(prompt, `Topic: ${topicTitle}\nContext:\n${syllabusContext}`, 20000) as LearningSummary
}

export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number // 0 to 3
}

export interface BossQuiz {
  bossName: string
  questions: QuizQuestion[]
}

/**
 * Generates a boss battle quiz for a milestone topic.
 */
export async function generateQuiz(topicTitle: string, syllabusContext: string, numQuestions: number = 5): Promise<BossQuiz> {
  const prompt = `You are the Game Master of a retro RPG. 
The player is facing a boss battle for the topic: "${topicTitle}".
Context: ${syllabusContext}
ALL OUTPUT TEXT MUST BE IN INDONESIAN (BAHASA INDONESIA).

Generate exactly ${numQuestions} multiple-choice questions to test their knowledge.
Output strictly in the following JSON format:
{
  "bossName": "Nama Bos Kreatif (e.g. Lord Syntax, The DOM Dragon)",
  "questions": [
    {
      "question": "Pertanyaan",
      "options": ["Opsi 1", "Opsi 2", "Opsi 3", "Opsi 4"],
      "answerIndex": 0 // index of correct option (0-3)
    }
  ]
}`

  return await callOpenRouter(prompt, `Topic: ${topicTitle}\nContext:\n${syllabusContext}`, 25000) as BossQuiz
}
