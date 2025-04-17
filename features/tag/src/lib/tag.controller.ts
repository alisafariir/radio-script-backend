import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return this.tagService.create(body.name, body.slug);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
