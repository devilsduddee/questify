// AI Service Layer for Questify
// Utilizes OpenRouter API to access Gemini models for generation tasks.
import { logger } from "@/utils/logger"

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
// Using Llama 3.1 8B Instruct via OpenRouter for fast, free JSON generation
const DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b:free"

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
        let errorMsg = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.clone().json()
          if (errorData.error && errorData.error.message) {
            errorMsg = `AI API Error (${response.status}): ${errorData.error.message}`
          }
        } catch {
          // Ignore if it's not JSON
        }
        throw new Error(errorMsg)
      }

      return response
    } catch (error: unknown) {
      clearTimeout(id)

      const err = error instanceof Error ? error : new Error(String(error))
      lastError = err

      if (err.name === 'AbortError') {
        logger.warn('AI', `Attempt ${attempt + 1} timed out.`)
      } else {
        logger.error('AI', `Attempt ${attempt + 1} failed: ${err.message}`)
      }

      if (attempt < retries) {
        // Stop aggressive retrying for rate limits
        if (err.message.includes('429')) {
          logger.warn('AI', '⚠️ Rate limit detected')
          if (attempt >= 1) { // Only retry once for 429
            throw new Error(`Rate limit exceeded. Try again later.`)
          }
          logger.info('AI', '⏱️ Waiting 2000ms...')
          logger.info('AI', `🔄 Retry ${attempt + 1}/${retries}`)
          await new Promise(resolve => setTimeout(resolve, 2000)) // Static limited backoff for 429
        } else {
          logger.info('AI', `⏱️ Waiting ${retryDelayMs * Math.pow(2, attempt)}ms...`)
          logger.info('AI', `🔄 Retry ${attempt + 1}/${retries}`)
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, retryDelayMs * Math.pow(2, attempt)))
        }
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
    ]
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
    logger.error('AI', `❌ Error Data format`, data)
    throw new Error(`AI Error: ${data.error?.message || "Invalid response format"}`)
  }

  let content = data.choices[0].message.content
  // Strip markdown code blocks if the LLM includes them
  content = content.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim()

  try {
    return JSON.parse(content)
  } catch {
    // Basic repair attempt if JSON is slightly malformed (e.g. trailing comma)
    try {
      const repaired = content.replace(/,\s*([\]}])/g, '$1')
      return JSON.parse(repaired)
    } catch {
      throw new Error("AI returned malformed JSON.")
    }
  }
}

// --- Domain Specific Generation Methods ---

interface QuestNodeData {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  isBoss: boolean
  chapterTheme?: string
  boss?: {
    name: string
    description: string
  }
}

export interface QuestMap {
  worldName: string
  worldSubtitle?: string
  worldDescription?: string
  worldElement?: string
  difficulty?: string
  openingNarration?: string
  theme?: {
    id: string
    palette: string
    terrain: string
    atmosphere: string
  }
  worldIcon?: string
  estimatedPlayTime?: string
  completionReward?: string
  nodes: QuestNodeData[]
}

/**
 * Parses syllabus text into a sequence of Quest Nodes.
 */
export async function generateQuest(syllabusText: string, playerRole?: string, storyStyle?: string): Promise<QuestMap> {
  const roleContext = playerRole ? `\n\nPLAYER ROLE: ${playerRole}\nSTORY STYLE: ${storyStyle}\nYou MUST frame the storytelling, opening narration, world description, and boss descriptions using the above story style and player role. However, the ACADEMIC CONTENT and LEARNING OBJECTIVES MUST REMAIN IDENTICAL and unchanged.` : "";
  const prompt = `You are a curriculum designer for a retro RPG game.
Your task is to take the following syllabus or learning material text and turn it into a structured "Quest Map".
CRITICAL REQUIREMENT: All generated lore summaries, relic names, and flashcard descriptions MUST be written in Indonesian with an immersive fantasy RPG tone. Do NOT output English text.${roleContext}

Extract the main topics into a sequential array of learning nodes. The first node should be available, the others locked, and the final node must be a boss node.

Text:
${syllabusText.substring(0, 5000)}

Output strictly in the following JSON format:
{
  "worldName": "Nama Dunia (e.g. Hutan HTML, Gua Python)",
  "worldSubtitle": "Subjudul dunia yang menarik",
  "worldDescription": "Satu kalimat ringkas tentang dunia ini",
  "theme": {
    "id": "contoh: dark-forest",
    "palette": "contoh: dark-green",
    "terrain": "contoh: forest",
    "atmosphere": "contoh: spooky"
  },
  "worldElement": "Elemen utama (e.g. Api, Es, Angin)",
  "difficulty": "Tingkat kesulitan (e.g. Beginner, Veteran)",
  "openingNarration": "Satu kalimat narasi pembuka yang sangat epik untuk modal intro",
  "worldIcon": "Emoji tunggal yang melambangkan dunia (e.g. 🌲)",
  "estimatedPlayTime": "Estimasi waktu (e.g. 2 Jam)",
  "completionReward": "Hadiah penyelesaian (e.g. Scroll of Mastery)",
  "nodes": [
    {
      "id": "1",
      "title": "Nama Quest (e.g. Pengenalan Dasar)",
      "description": "Deskripsi quest ini",
      "difficulty": "easy" | "medium" | "hard",
      "isBoss": false,
      "chapterTheme": "Tema area untuk quest ini"
    },
    {
      "id": "2",
      "title": "...",
      "description": "...",
      "difficulty": "hard",
      "isBoss": true,
      "chapterTheme": "Markas Bos Akhir",
      "boss": {
        "name": "Nama bos keren (e.g. Lord Syntax)",
        "description": "Deskripsi singkat bos ini"
      }
    }
  ]
}`

  logger.info('AI', '🤖 generateQuest START')
  logger.info('AI', '📚 Processing syllabus...')
  const startTime = performance.now()
  logger.info('AI', '⏳ Waiting for OpenRouter...')

  try {
    const result = await callOpenRouter(prompt, syllabusText, 25000) as QuestMap
    const duration = ((performance.now() - startTime) / 1000).toFixed(2)
    logger.success('AI', `✅ generateQuest SUCCESS (${duration}s)`)
    logger.info('AI', `📦 Nodes generated: ${result.nodes.length}`)
    return result
  } catch (err: any) {
    logger.error('AI', '❌ generateQuest FAILED')
    logger.error('AI', `❌ Message: ${err.message}`)
    throw err
  }
}

export interface LearningSummary {
  content: string
  keyPoints: string[]
}

/**
 * Generates an ancient scroll summary for a specific quest topic.
 */
export async function generateSummary(topicTitle: string, syllabusContext: string, playerRole?: string, storyStyle?: string): Promise<LearningSummary> {
  const roleContext = playerRole ? `\n\nPLAYER ROLE: ${playerRole}\nSTORY STYLE: ${storyStyle}\nYou MUST frame the narrative summary using the above story style and player role. However, the ACADEMIC CONTENT and KEY POINTS MUST REMAIN IDENTICAL and mathematically/factually accurate.` : "";
  const prompt = `You are an AI scholar in a retro RPG game.
The player has encountered a quest node titled: "${topicTitle}".
Context: ${syllabusContext}
CRITICAL REQUIREMENT: All generated lore summaries, relic names, and flashcard descriptions MUST be written in Indonesian with an immersive fantasy RPG tone. Do NOT output English text.${roleContext}

Provide a learning summary in the following JSON format:
{
  "content": "Penjelasan utama materi secara naratif dan menarik layaknya sebuah cerita pendek RPG (2-3 paragraf)",
  "keyPoints": [
    "Poin penting 1",
    "Poin penting 2",
    "Poin penting 3"
  ]
}`

  logger.info('AI', '🤖 generateSummary START')
  const startTime = performance.now()
  logger.info('AI', '⏳ Waiting for OpenRouter...')

  try {
    const result = await callOpenRouter(prompt, `Topic: ${topicTitle}\nContext:\n${syllabusContext}`, 20000) as LearningSummary
    const duration = ((performance.now() - startTime) / 1000).toFixed(2)
    logger.success('AI', `✅ generateSummary SUCCESS (${duration}s)`)
    return result
  } catch (err: any) {
    logger.error('AI', '❌ generateSummary FAILED')
    logger.error('AI', `❌ Message: ${err.message}`)
    throw err
  }
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
export async function generateQuiz(topicTitle: string, syllabusContext: string, numQuestions: number = 5, playerRole?: string, storyStyle?: string): Promise<BossQuiz> {
  const roleContext = playerRole ? `\n\nPLAYER ROLE: ${playerRole}\nSTORY STYLE: ${storyStyle}\nYou MUST frame the boss identity and questions flavor using the above story style and player role. However, the ACADEMIC CONTENT, QUESTIONS DIFFICULTY, and CORRECT ANSWERS MUST REMAIN IDENTICAL and unchanged.` : "";
  const prompt = `You are the Game Master of a retro RPG. 
The player is facing a boss battle for the topic: "${topicTitle}".
Context: ${syllabusContext}
CRITICAL REQUIREMENT: All generated lore summaries, relic names, and flashcard descriptions MUST be written in Indonesian with an immersive fantasy RPG tone. Do NOT output English text.${roleContext}

Generate exactly ${numQuestions} multiple-choice questions that test the player's knowledge.
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

  logger.info('AI', '🤖 generateQuiz START')
  const startTime = performance.now()
  logger.info('AI', '⏳ Waiting for OpenRouter...')

  try {
    const result = await callOpenRouter(prompt, `Topic: ${topicTitle}\nContext:\n${syllabusContext}`, 25000) as BossQuiz
    const duration = ((performance.now() - startTime) / 1000).toFixed(2)
    logger.success('AI', `✅ generateQuiz SUCCESS (${duration}s)`)
    logger.info('AI', `📦 Questions generated: ${result.questions.length}`)
    return result
  } catch (err: any) {
    logger.error('AI', '❌ generateQuiz FAILED')
    logger.error('AI', `❌ Message: ${err.message}`)
    throw err
  }
}
