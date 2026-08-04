import React, { useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText } from "lucide-react"
import { cn } from "@/utils/cn"

interface UploadAreaProps {
  onUpload: (file: File) => void
  className?: string
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, className }) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  return (
    <motion.div
      className={cn(
        "relative w-full max-w-xl mx-auto border-4 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
        isDragOver ? "border-primary bg-primary/10 box-glow" : "border-muted bg-background/50 hover:border-secondary hover:bg-secondary/5",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <input 
        id="file-upload"
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden" 
        accept=".pdf,.txt"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files[0])
          }
        }}
      />
      <div className="flex flex-col items-center justify-center gap-4 pointer-events-none">
        <motion.div
          animate={isDragOver ? { y: [0, -10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {isDragOver ? (
            <Upload className="w-16 h-16 text-primary text-glow" />
          ) : (
            <FileText className="w-16 h-16 text-muted-foreground" />
          )}
        </motion.div>
        <div className="font-heading text-xl">
          {isDragOver ? "Lepaskan gulungan di sini..." : "Unggah Silabus atau Modul"}
        </div>
        <p className="text-sm text-muted-foreground font-sans">
          Dukungan format PDF atau TXT untuk menyusun petualanganmu.
        </p>
      </div>
    </motion.div>
  )
}
