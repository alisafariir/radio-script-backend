import { Global, Module } from '@nestjs/common';
import { PostMetaController } from './post-meta.controller';
import { PostMetaService } from './post-meta.service';

@Global()
@Module({
  controllers: [PostMetaController],
  providers: [PostMetaService],
  exports: [PostMetaService],
})
export class PostMetaModule {}
