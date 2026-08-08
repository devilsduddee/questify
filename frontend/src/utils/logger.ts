export const isDev = import.meta.env.DEV

type LogCategory = 'Questify' | 'Auth' | 'Cloud' | 'HYDRATION' | 'AI' | 'Quest' | 'Battle' | 'Navigation' | 'App' | 'Store' | 'Role'

class Logger {
  private format(category: LogCategory, message: string) {
    return `[${category}] ${message}`
  }

  info(category: LogCategory, message: string) {
    if (isDev) console.log(this.format(category, message))
  }

  success(category: LogCategory, message: string) {
    if (isDev) console.log(this.format(category, message))
  }

  warn(category: LogCategory, message: string) {
    if (isDev) console.warn(this.format(category, message))
  }

  error(category: LogCategory, message: string, error?: any) {
    if (isDev) {
      if (error) {
        console.error(this.format(category, message), error)
      } else {
        console.error(this.format(category, message))
      }
    } else if (error) {
      console.error(this.format(category, message), error)
    }
  }
}

export const logger = new Logger()
