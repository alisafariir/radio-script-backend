import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { SmsService } from './sms.service';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
