/**
 * Cloudflare Workers 日志适配器
 * 使用 console.log 替代 winston，满足 Workers 环境要求
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  stack?: string;
}

class WorkersLogger {
  private formatLog(level: LogLevel, message: string, stack?: string): string {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    const levelColors: Record<LogLevel, string> = {
      error: '🔴',
      warn: '🟡',
      info: '🔵',
      debug: '🟢',
    };

    const color = levelColors[level] || '⚪';
    let logMessage = `${color} [${level.toUpperCase()}] [${timestamp}] ${message}`;
    
    if (stack) {
      logMessage += `\n${stack}`;
    }
    
    return logMessage;
  }

  debug(message: string): void {
    console.log(this.formatLog('debug', message));
  }

  info(message: string): void {
    console.info(this.formatLog('info', message));
  }

  warn(message: string): void {
    console.warn(this.formatLog('warn', message));
  }

  error(message: string | Error, stack?: string): void {
    const errorMsg = message instanceof Error ? message.message : message;
    const errorStack = message instanceof Error ? message.stack : stack;
    console.error(this.formatLog('error', errorMsg, errorStack || undefined));
  }
}

// 导出单例
const logger = new WorkersLogger();
export default logger;
