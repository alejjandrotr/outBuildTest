import * as Winston from 'winston';
const { combine, timestamp } = Winston.format;

export class Logger {
  private readonly logger: Winston.Logger;
  constructor() {
    this.logger = Winston.createLogger({
      format: combine(timestamp(), Winston.format.json()),
      transports: [new Winston.transports.Console()],
    });
  }
  log(message: string, structure?: unknown): void {
    this.logger.info(message, structure);
  }
  error(message: string, structure?: unknown): void {
    this.logger.error(message, structure);
  }
  warn(message: string, structure?: unknown): void {
    this.logger.warn(message, structure);
  }
  debug(message: string, structure?: unknown): void {
    this.logger.debug(message, structure);
  }
  verbose(message: string, structure?: unknown): void {
    this.logger.verbose(message, structure);
  }
}

export const logger = new Logger();