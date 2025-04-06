// src/token/token-cleanup.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService } from './token.service';

@Injectable()
export class TokenCleanupScheduler {
  private readonly logger = new Logger(TokenCleanupScheduler.name);

  constructor(private readonly tokenService: TokenService) {}

  // Run every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running expired token cleanup job...');

    try {
      const deletedCount = await this.tokenService.deleteExpiredTokens();
      this.logger.log(`Deleted ${deletedCount} expired tokens`);
    } catch (error) {
      this.logger.error('Failed to delete expired tokens', error.stack);
    }
  }
}
