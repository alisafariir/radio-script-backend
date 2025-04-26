// src/post-meta/post-meta.service.ts
import { CreatePostMetaDto, UpdatePostMetaDto } from '@/dtos';
import { Post, PostMeta } from '@/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostMetaService {
  constructor(@InjectRepository(PostMeta) private readonly metaRepo: Repository<PostMeta>, @InjectRepository(Post) private readonly postRepo: Repository<Post>) {}

  async create(dto: CreatePostMetaDto): Promise<PostMeta> {
    const post = await this.postRepo.findOneByOrFail({ id: dto.postId });
    const meta = this.metaRepo.create({ key: dto.key, value: dto.value, post });
    return this.metaRepo.save(meta);
  }

  async findAll(postId: string) {
    return this.metaRepo.find({ where: { post: { id: postId } } });
  }

  async update(id: string, dto: UpdatePostMetaDto): Promise<PostMeta> {
    const meta = await this.metaRepo.findOneBy({ id });
    if (!meta) throw new NotFoundException('Meta not found');
    Object.assign(meta, dto);
    return this.metaRepo.save(meta);
  }

  async remove(id: string) {
    const meta = await this.metaRepo.findOneBy({ id });
    if (!meta) throw new NotFoundException('Meta not found');
    return this.metaRepo.softRemove(meta);
  }

  async recover(id: string) {
    const cat = await this.metaRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    return this.metaRepo.recover(cat);
  }
  deleted() {
    return this.metaRepo.find({
      withDeleted: true,
    });
  }
}
