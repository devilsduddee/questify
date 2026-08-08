import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Type, AlertCircle, CheckCircle2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button, MotionButton } from "@/components/ui/button"
import { UploadArea } from "@/components/common/UploadArea"
import { FadeIn, SlideUp } from "@/components/common/AnimationWrapper"
import { cn } from "@/utils/cn"
import { validateFile, parseTxtFile, parsePdfFile } from "./utils"
import { generateQuest } from "@/services/ai.service"
import { usePlayerStore } from "@/store/usePlayerStore"
import { getRoleById } from "@/data/roles"
import { useAdventureStore } from "@/store/useAdventureStore"
import { useNavigate } from "react-router-dom"

type Tab = "file" | "text"

export const SyllabusUpload: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("file")
  const [textInput, setTextInput] = useState("")
  const [parsedText, setParsedText] = useState("")
  const [fileName, setFileName] = useState("")
  const [isParsing, setIsParsing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const createNewAdventure = useAdventureStore(state => state.createNewAdventure)

  const handleFileUpload = async (file: File) => {
    setError(null)
    setParsedText("")
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setFileName(file.name)
    setIsParsing(true)

    try {
      let content = ""
      if (file.type === "application/pdf") {
        content = await parsePdfFile(file)
      } else if (file.type === "text/plain") {
        content = await parseTxtFile(file)
      }
      
      setParsedText(content)
    } catch (err: any) {
      setError(err.message || "An error occurred while parsing the file.")
    } finally {
      setIsParsing(false)
    }
  }

  const handleManualSubmit = () => {
    if (!textInput.trim()) {
      setError("Please enter some text.")
      return
    }
    setError(null)
    setFileName("Manual Input")
    setParsedText(textInput)
  }

  const resetUpload = () => {
    setParsedText("")
    setFileName("")
    setError(null)
  }

  const handleGenerateQuest = async () => {
    if (!parsedText) return
    setIsGenerating(true)
    setError(null)
    
    try {
      const { role } = usePlayerStore.getState()
      const roleDef = getRoleById(role)
      const result = await generateQuest(parsedText, roleDef?.name, roleDef?.storyStyle)
      // Result is already validated by ai.service.ts
      // Generate a course name based on fileName, or just "Manual Input"
      const courseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "Course"
      createNewAdventure(courseName, result.worldName, result.nodes, {
        worldSubtitle: result.worldSubtitle,
        worldDescription: result.worldDescription,
        worldElement: result.worldElement,
        difficulty: result.difficulty,
        openingNarration: result.openingNarration,
        theme: result.theme,
        worldIcon: result.worldIcon,
        estimatedPlayTime: result.estimatedPlayTime,
        completionReward: result.completionReward
      })
      navigate('/map')
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e.message || "Sistem AI gagal menyusun peta. Silakan coba lagi.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card variant="scroll" className="p-2 border-primary/50">
        
        {/* Custom Tabs */}
        <div className="flex border-b border-border/50 mb-6">
          <button
            onClick={() => { setActiveTab("file"); resetUpload(); }}
            className={cn(
              "flex-1 py-4 flex items-center justify-center gap-2 font-heading tracking-wide transition-colors relative",
              activeTab === "file" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="w-4 h-4" />
            Unggah File
            {activeTab === "file" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow-quest" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab("text"); resetUpload(); }}
            className={cn(
              "flex-1 py-4 flex items-center justify-center gap-2 font-heading tracking-wide transition-colors relative",
              activeTab === "text" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Type className="w-4 h-4" />
            Teks Manual
            {activeTab === "text" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow-quest" />
            )}
          </button>
        </div>

        <CardContent className="pt-2">
          {error && (
            <FadeIn>
              <div className="mb-6 p-4 rounded-md border border-destructive bg-destructive/10 text-destructive flex items-center gap-3 pixel-border text-sm font-sans">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            </FadeIn>
          )}

          <AnimatePresence mode="wait">
            {!parsedText ? (
              <SlideUp key={activeTab}>
                {activeTab === "file" ? (
                  <div className="flex flex-col items-center">
                    <UploadArea onUpload={handleFileUpload} />
                    {isParsing && (
                      <p className="mt-4 text-secondary font-pixel text-xs animate-pulse">Sedang membaca materi...</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <textarea 
                      className="w-full h-64 p-4 rounded-md border border-input bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none font-sans box-glow"
                      placeholder="Tempelkan teks silabus atau kurikulum di sini..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <MotionButton onClick={handleManualSubmit} variant="default" className="font-pixel text-xs">
                        Validasi Teks
                      </MotionButton>
                    </div>
                  </div>
                )}
              </SlideUp>
            ) : (
              <SlideUp key="preview">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-heading font-bold text-lg">Materi Berhasil Dibaca</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={resetUpload} className="text-muted-foreground">
                      Atur Ulang
                    </Button>
                  </div>
                  
                  <div className="bg-background/80 rounded-md border border-input p-6 h-64 overflow-y-auto custom-scrollbar font-sans text-sm text-foreground/90 whitespace-pre-wrap">
                    {parsedText}
                  </div>

                  <div className="flex justify-center pt-4">
                    <MotionButton 
                      size="lg" 
                      variant="secondary" 
                      className="w-full max-w-sm font-heading text-lg"
                      onClick={handleGenerateQuest}
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Menyusun Peta AI..." : "Buat Peta Petualangan"}
                    </MotionButton>
                  </div>
                </div>
              </SlideUp>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
