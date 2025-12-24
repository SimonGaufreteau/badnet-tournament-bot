const log = (level: string, message: string, ...args: any[]) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [${level}] ${message}`, ...args)
}

export const logger = {
  info: (message: string, ...args: any[]) => log('INFO', message, ...args),
  error: (message: string, ...args: any[]) => log('ERROR', message, ...args),
  warn: (message: string, ...args: any[]) => log('WARN', message, ...args)
}
