import { Controller } from '@nestjs/common';
import { PostMetaService } from './post-meta.service';

@Controller('post-meta')
export class PostMetaController {
  constructor(private postMetaService: PostMetaService) {}
}
