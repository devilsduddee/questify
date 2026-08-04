import * as pdfjsLib from 'pdfjs-dist'

// Set worker path to standard CDN to avoid Vite build configuration issues for MVP
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `Ukuran file terlalu besar. Maksimal 5MB.`
  }

  const validTypes = ['application/pdf', 'text/plain']
  if (!validTypes.includes(file.type)) {
    return `Format file tidak didukung. Hanya PDF dan TXT yang diperbolehkan.`
  }

  return null
}

export const parseTxtFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('Gagal membaca file TXT.'))
    reader.readAsText(file)
  })
}

export const parsePdfFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(' ')
      fullText += pageText + '\n\n'
    }
    
    return fullText.trim()
  } catch {
    throw new Error('Gagal mengekstrak PDF. Pastikan file berisi teks yang bisa dibaca (bukan sekadar gambar).')
  }
}
